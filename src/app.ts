import 'reflect-metadata'
import {useKoaServer} from "routing-controllers"
import * as Koa from 'koa'

import UserController from './controllers/users'
import LoginController from './controllers/logins'

const app = new Koa()

useKoaServer(app,{
  cors: true,
  controllers: [
    UserController,
    LoginController
  ]
})

export default app
