import {JsonController, Post, Body, Param, Authorized, CurrentUser,
    ForbiddenError, NotFoundError} from 'routing-controllers'
import {Message} from '../entities/Message'
import {User} from '../entities/User'
import {Channel} from '../entities/Channel'
import {containsUser} from '../lib/functions'
import {io} from '../socket'

@JsonController()
export default class MessageController {
  @Authorized()
  @Post('/messages/channels/:channelId')
  async addMessage(
    @Param('channelId') channelId: number,
    @CurrentUser() user: User,
    @Body() {body}: Message
  ){
    const channel = await Channel.findOne({id:channelId})
    if (!channel) throw new NotFoundError('Channel not found')
    if (!containsUser(channel.users, user))
      throw new ForbiddenError('User not allowed to post a message in the channel')
    const message = await Message.create({body,user,channel}).save()

    const userNames = channel.users.map(user=> user.userName)
    userNames.forEach(name=>{
      io.to(name).emit('action',{
        type: 'ADD_MESSAGE',
        payload: {
          channelId,
          body: message.body
        }
      })
    })
    return {
      message: 'Message successfully sent'
    }
  }
}
