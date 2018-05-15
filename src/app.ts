import 'reflect-metadata'
import {useKoaServer, Action, BadRequestError} from "routing-controllers"
import * as Koa from 'koa'
import {verify} from './jwt'
import UserController from './controllers/users'
import LoginController from './controllers/logins'

const app = new Koa()

useKoaServer(app,{
  cors: true,
  controllers: [
    UserController,
    LoginController
  ],
  authorizationChecker: (action: Action) => {
    const header: string = action.request.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      const [, token] = header.split(' ');

      try {
        return !!(token && verify(token));
      } catch (e) {
          throw new BadRequestError(e);
        }
    }
    return false;
  },
  currentUserChecker: async (action: Action) => {
    const header: string = action.request.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      const [, token] = header.split(' ');

      if (token) {
        const { id, role } = verify(token);
        return { id, role }
      }
    }
    return undefined;
  }
})

export default app
