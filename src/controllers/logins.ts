import {JsonController, Post, Body, BadRequestError, NotFoundError} from 'routing-controllers'
import { IsString } from 'class-validator'
import {User} from '../entities/User'
import {sign} from '../jwt'

class AuthenticatePayload {
  @IsString()
  email: string

  @IsString()
  password: string
}

@JsonController()
export default class LoginController{
  @Post('/logins')
  async authenticate(
    @Body() {email, password}: AuthenticatePayload
  ){
    const user = await User.findOne({where: {email}})
    if (!user) throw new NotFoundError('User not found in the database')

    if (password === '')
      throw new BadRequestError('Please give a password')

    if (!await user.checkPassword(password))
      throw new BadRequestError('Password not correct')

    const jwt = sign({ id: user.id!, role: user.role! })
    return { jwt }
  }
}
