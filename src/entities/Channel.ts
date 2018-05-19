import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from 'typeorm'
import {BaseEntity} from 'typeorm/repository/BaseEntity'
import {IsString} from 'class-validator'
import {User} from './User'

@Entity()
export class Channel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @Column('text', {nullable: true})
  name: string

  @ManyToMany(_=> User, user => user.channels, {eager:true})
  @JoinTable({name: 'channels_users'})
  users: User[]
}
