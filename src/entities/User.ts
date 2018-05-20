import {Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany, OneToMany,
   JoinColumn} from 'typeorm'
import {BaseEntity} from 'typeorm/repository/BaseEntity'
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt'
import {IsString, MinLength, IsEmail, IsBoolean, IsDate} from 'class-validator'
import {Profile} from './Profile'
import {Channel} from './Channel'
import {Message} from './Message'

export type Role = 'user'|'admin';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @MinLength(2)
  @Column('text')
  userName: string

  @IsEmail()
  @Column('text')
  email: string

  @IsString()
  @MinLength(8)
  @Column('text')
  @Exclude({ toPlainOnly: true })
  password: string;

  @IsString()
  @Column('text', {default:'user'})
  @Exclude({ toPlainOnly: true })
  role: Role

  @IsDate()
  @Column('date', {default: () => 'CURRENT_DATE'})
  @Exclude({ toPlainOnly: true })
  joinDate: Date

  @IsBoolean()
  @Column('boolean', {default: false})
  @Exclude({ toPlainOnly: true })
  emailConfirmed: boolean

  @OneToOne(_ => Profile, profile => profile.user, {onDelete: 'CASCADE'})
  @JoinColumn()
  profile: Profile

  @ManyToMany(_=> Channel, channel => channel.users)
  channels: Channel[]

  @OneToMany(_=> Message, message => message.user)
  messages: Message[]

  async setPassword(rawPassword: string) {
    const hash = await bcrypt.hash(rawPassword, 10);
    this.password = hash;
  }

  checkPassword(rawPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, this.password);
  }
}
