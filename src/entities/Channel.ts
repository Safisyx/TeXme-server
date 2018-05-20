import {Entity, PrimaryColumn, Column, ManyToMany, OneToMany,
  JoinTable, Generated} from 'typeorm'
import {BaseEntity} from 'typeorm/repository/BaseEntity'
import {IsString} from 'class-validator'
import {User} from './User'
import {Message} from './Message'

@Entity()
export class Channel extends BaseEntity {
  @PrimaryColumn('bigint')
  @Generated()
  id?: number

  @IsString()
  @Column('text', {nullable: true})
  name: string

  @ManyToMany(_=> User, user => user.channels, {eager:true})
  @JoinTable({
    name: 'channels_users',
    joinColumns: [
        { name: 'channel_id' }
    ],
    inverseJoinColumns: [
        { name: 'user_id' }
    ]
  })
  users: User[]

  @OneToMany(_=> Message, message => message.channel, {eager:true})
  messages: Message[]
}
