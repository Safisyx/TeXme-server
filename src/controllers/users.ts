import {JsonController, Post, Patch, Get, Body, Delete, HttpCode, Param,
       BadRequestError, NotFoundError, ForbiddenError,
       Authorized, CurrentUser} from 'routing-controllers'
import {IsString, MinLength} from 'class-validator'
import {User, Role} from '../entities/User'
import {Profile} from '../entities/Profile'
import {sendSignUpMail, sendForgotPasswordMail} from '../mail/templates'
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
class PasswordReset{
  @IsString()
  @MinLength(8)
  password: string

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
      message: 'An email containing a link to confirm the email address has been sent'
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
      message: 'An email containing a link to confirm the email address has been sent'
    }
  }

  @Post('/forgot-password')
  async forgotPassword(
    @Body() {email}: Partial<User>
  ){
    const user = await User.findOne({where:{email}})
    if (!user) throw new NotFoundError('User not found')
    const jwt=signup({ id: user.id!, email: user.email! })

    try {
      await sendForgotPasswordMail(user.email, jwt)
    } catch(err) {
      return {
        type: 'error',
        message: err.message
      }
    }
    return {
      type: 'success',
      message: 'An email containing a link to reset the password has been sent'
    }
  }

  @Patch('/reset-password')
  async resetPassword(
    @Body() {password, token}: PasswordReset,
  ){
    const {id,email} = verifySignup(token)
    if (!id || !email)
      throw new BadRequestError('Almost right token but not')

    const user = await User.findOne({where:{id}})
    if (!user) throw new NotFoundError('User not found')
    if (user.email !== email)
      throw new BadRequestError('Not the right email')

    await user.setPassword(password)
    await user.save()
    return {
      message: 'Password has been reset'
    }
  }

  @Authorized()
  @Get('/users')
  async getUsers(
    @CurrentUser() {role}: User
  ){
    if (role!=='admin')
      throw new ForbiddenError('The user is not allowed to access this')
    return await User.find()
  }

  @Authorized()
  @Get('/users/:userId')
  async getUser(
    @CurrentUser() {id, role}: User,
    @Param('userId') userId: number,
  ){
    if (role!=='admin' || id!==userId)
      throw new ForbiddenError('The user is not allowed to access this')
    return await User.findOne({where:{id: userId}})
  }

  @Authorized()
  @Delete('/users/:userId([0-9]+)')
  async deleteUser(
    @CurrentUser() {id, role}: User,
    @Param('userId') userId: number
  ){
    const user = await User.findOne({where: {id: userId}})
    if (!user) throw new NotFoundError('Not in the database')
    if ((role==='user' && id!==userId) || (role==='admin' && user.emailConfirmed))
      throw new ForbiddenError('The current user is not allowed to delete this')
    user.remove()
    return {
      message: `user with id=${userId} is successfully deleted!`
    }
  }
}
