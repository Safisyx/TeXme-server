import {JsonController, Post, Get, Body, Authorized, CurrentUser} from 'routing-controllers'
import {Channel} from '../entities/Channel'
import {User} from '../entities/User'
import {IsArray, IsInt}  from 'class-validator'
import {getRepository} from 'typeorm'

class ChannelCreator {
  name: string
  @IsArray()
  @IsInt({each:true})
  userIds: number[]=[]
}
@JsonController()
export default class ChannelController {
  @Authorized()
  @Post('/channels')
  async createChannel(
    @CurrentUser() user: User,
    @Body() {name, userIds}: ChannelCreator
  ){
    const channel = await Channel.create({name})
    channel.users = [user].concat(userIds.length===0?[]:
      await getRepository(User)
        .createQueryBuilder('user')
        .where("user.id IN (:...userIds)",{userIds})
        .getMany())
    await channel.save()
    return channel
  }

  @Authorized()
  @Get('/channels')
  async getChannels(
    @CurrentUser() user: User
  ){
    const channels = await Channel.find()
    return channels.filter(channel => {
      return channel.users.map(u => u.id)
                    .includes(user.id)
    })
  }
}
