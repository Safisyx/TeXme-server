import {JsonController, Post, Body, HttpCode } from 'routing-controllers'
import {User, Role} from '../entities/User'
import {Profile} from '../entities/Profile'

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
    return await user.save()
  }
}
