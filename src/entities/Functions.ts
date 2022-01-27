import { Entity, Property } from '@mikro-orm/core'
import { Field, InputType, ObjectType } from 'type-graphql'
import { MongoClass } from './MongoClass'

@InputType()
export class functionsInput {
	@Field()
	order: string

	@Field()
	name: string
}
@ObjectType({ implements: MongoClass })
@Entity()
export class Functions extends MongoClass {
	@Field()
	@Property()
	order!: string

	@Field()
	@Property()
	name!: string
}