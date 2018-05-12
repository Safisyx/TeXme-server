import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from 'typeorm'
import {BaseEntity} from 'typeorm/repository/BaseEntity'
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt'
import {IsString, MinLength, IsEmail, IsBoolean, IsDate} from 'class-validator'
import {Profile} from './Profile'

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
  role: Role

  @IsDate()
  @Column('date', {default: () => 'CURRENT_DATE'})
  joinDate: Date

  @IsBoolean()
  @Column('boolean', {default: false})
  emailConfirmed: boolean

  @OneToOne(_ => Profile, profile => profile.user, {onDelete: 'CASCADE'})
  @JoinColumn()
  profile: Profile

  async setPassword(rawPassword: string) {
    const hash = await bcrypt.hash(rawPassword, 10);
    this.password = hash;
  }

  checkPassword(rawPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, this.password);
  }
}
