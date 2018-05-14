import {JsonController, Post, Body, HttpCode } from 'routing-controllers'
import {User, Role} from '../entities/User'
import {Profile} from '../entities/Profile'
import {sendSignUpMail} from '../mail/templates'
import {signup} from '../jwt'

interface UserAndProfile {
  userName: string
  email: string
  password: string
  role?: Role
  name: string
  birthDate?: string
  countryOfOrigin: string
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
}
