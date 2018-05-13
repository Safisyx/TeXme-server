import {Entity, PrimaryGeneratedColumn, Column, OneToOne} from 'typeorm'
import {BaseEntity} from 'typeorm/repository/BaseEntity'
import {IsString, MinLength, IsDate} from 'class-validator'
import {User} from './User'
@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @MinLength(2)
  @Column('text')
  name: string

  @IsDate()
  @Column('date', {nullable: true})
  birthDate: Date

  @IsString()
  @Column('text', {nullable: true})
  countryOfOrigin: string

  @OneToOne(_ => User, user => user.profile)
  user: User
}
