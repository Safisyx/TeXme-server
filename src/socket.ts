import app from './app'
import {secret} from './jwt'
import {User} from './entities/User'
import {Server} from 'http'
import * as IO from 'socket.io'
import * as socketIoJwtAuth from 'socketio-jwt-auth'

const server = new Server(app.callback())
export const io = IO(server)

io.use(socketIoJwtAuth.authenticate({ secret }, async (payload, done) => {
  const user = await User.findOne({id: payload.id})
  if (user) done(null, user)
  else done(null, false, `Invalid JWT user ID`)
}))

io.on('connect', socket => {
  const user = socket.request.user
  console.log(`User ${user.userName} just connected.`)
  socket.join(`${user.userName}`)

  socket.on('disconnect', () => {
    socket.leave(`${user.userName}`)
    console.log(`User ${user.userName} just disconnected`)
  })
})

export default server
