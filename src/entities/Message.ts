import {Entity, PrimaryColumn, Column, ManyToOne,
  RelationId, Generated} from 'typeorm'
import {BaseEntity} from 'typeorm/repository/BaseEntity'
import {IsString} from 'class-validator'
import {User} from './User'
import {Channel} from './Channel'

@Entity()
export class Message extends BaseEntity {
  @PrimaryColumn()
  @Generated()
  id?: number

  @IsString()
  @Column('text')
  body: string

  @Column('timestamp', {default: () => "CURRENT_TIMESTAMP"})
  createdAt: Date

  @ManyToOne(_=> User, user => user.messages)
  user: User

  @RelationId((message: Message) => message.user)
  userId: number

  @ManyToOne(_=> Channel, channel => channel.messages)
  channel: Channel
}
