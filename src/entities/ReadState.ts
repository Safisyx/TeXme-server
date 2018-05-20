import {Entity, PrimaryColumn, Column} from 'typeorm'
import {BaseEntity} from 'typeorm/repository/BaseEntity'
import {IsDate} from 'class-validator'

@Entity({name:'read_states'})
export class ReadState extends BaseEntity{
@PrimaryColumn('bigint')
messageId: number

@PrimaryColumn('bigint')
userId: number

@IsDate()
@Column('timestamp',{default: ()=> 'CURRENT_DATE'})
readDate: Date
}
