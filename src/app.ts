import 'reflect-metadata'
import {useKoaServer, Action, BadRequestError, NotFoundError} from "routing-controllers"
import * as Koa from 'koa'
import {verify} from './jwt'
import {User} from './entities/User'
import UserController from './controllers/users'
import LoginController from './controllers/logins'
import ChannelController from './controllers/channels'
import MessageController from './controllers/messages'

const app = new Koa()

useKoaServer(app,{
  cors: true,
  controllers: [
    UserController,
    LoginController,
    ChannelController,
    MessageController
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
        const user = await User.findOne({where:{id}})
        if (!user) throw new NotFoundError('No associate user')
        if (user.role !== role)
          throw new BadRequestError('Role does not match')
        return user
      }
    }
    return undefined;
  }
})

export default app
