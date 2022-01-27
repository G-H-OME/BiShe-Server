import { Functions } from "../entities/Functions";
import { Mycontext } from "../mikro-orm.config";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";

@ObjectType()
export class FieldError {
    @Field()
    field:string
    @Field()
    message:string
}

@ObjectType()
export class FunResponse {
    @Field(()=>[FieldError],{nullable:true})
    errors?:FieldError[]
    @Field(()=>Functions,{nullable:true})
    fun?:Functions
    static createError(field:string,message:string){
        return {
            fun:undefined,
            errors:[{
                field,
                message
            }]
        }
    }
}

@Resolver(Functions)
export class FunResolver{
    @Mutation(()=>Functions)
    async createFun(
        @Ctx(){em}:Mycontext,
        @Arg('order')order:string,
        @Arg('name')name:string
    ):Promise<Functions>{
        const fun = em.create(Functions,{order,name})
        await em.persistAndFlush(fun)
        return fun
    }

    @Mutation(()=>Boolean)
    async deleteFun(
        @Ctx(){em}:Mycontext,
        @Arg('id')id:string
    ):Promise<Boolean>{
        await em.nativeDelete(Functions,{id})
        return true
    }

    @Query(()=>[Functions],{nullable:true})
    fun(
        @Ctx(){em}:Mycontext
    ):Promise<Functions[]>{
        return em.find(Functions,{})
    }
}