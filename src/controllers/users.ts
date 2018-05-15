import {JsonController, Post, Body, HttpCode,
       BadRequestError, NotFoundError } from 'routing-controllers'
import {IsString} from 'class-validator'
import {User, Role} from '../entities/User'
import {Profile} from '../entities/Profile'
import {sendSignUpMail} from '../mail/templates'
import {signup,verifySignup} from '../jwt'

interface UserAndProfile {
  userName: string
  email: string
  password: string
  role?: Role
  name: string
  birthDate?: string
  countryOfOrigin: string
}
class Token{
  @IsString()
  token: string
}
@JsonController()
export default class UserController{
  @Post('/signup')
  @HttpCode(201)
  async signupUser(
    @Body() body: UserAndProfile
  ){
    const {name, birthDate, countryOfOrigin} = body
    const profile = await Profile.create({name, birthDate, countryOfOrigin}).save()
    const {userName, email, password, role} = body
    const user = User.create({userName, email, role, profile})
    await user.setPassword(password)
    await user.save()

    const jwt=signup({ id: user.id!, email: email! })

    try {
      await sendSignUpMail(user.email, jwt)
    } catch(err) {
      return {
        type: 'error',
        message: err.message
      }
    }
    return {
      type: 'success',
      message: 'An email containning a link to confirm the email address has been sent'
    }
  }

  @Post('/verify-email')
  async verifyEmail(
    @Body() {token}:Token
  ){
    const {id,email} = verifySignup(token)
    if (!id || !email)
      throw new BadRequestError('Almost right token but not')

    const user = await User.findOne({where:{id}})
    if (!user) throw new NotFoundError('User not found')
    if (user.email !== email)
      throw new BadRequestError('Not the right email')

    user.emailConfirmed=true
    await user.save()
    return {
      message: 'The email address has been verified'
    }
  }

  @Post('/resend-confirmation-link')
  async resendEmail(
    @Body() {email}: Partial<User>
  ){
    const user = await User.findOne({where:{email}})
    if (!user) throw new NotFoundError('User not found')
    const jwt=signup({ id: user.id!, email: user.email! })

    try {
      await sendSignUpMail(user.email, jwt)
    } catch(err) {
      return {
        type: 'error',
        message: err.message
      }
    }
    return {
      type: 'success',
      message: 'An email containning a link to confirm the email address has been sent'
    }
  }
}
