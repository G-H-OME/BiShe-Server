import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import {MikroORM} from '@mikro-orm/core'
import { ApolloServer } from "apollo-server-express"
import mikroConfig from './mikro-orm.config'
import { buildSchema } from 'type-graphql'
import http from 'http'
import { FunResolver } from './resolvers/functions'
dotenv.config( { path: path.join( __dirname, '..', '.env' ) } )

const main = async() => {
  const orm = await MikroORM.init(mikroConfig)
  const app = express()

  const apolloServer = new ApolloServer( {
    schema: await buildSchema( {
      resolvers: [
        FunResolver
      ],
      validate: false,
    } ),
    context: ( { req, res } ) => ( {
      em: orm.em,
      req,
      res
    } )
  } )
  app.use( cors() )
  const PORT = process.env.PORT
  app.use( express.static( path.join( __dirname, '..', 'public' ) ) )
  app.use( express.json() )
  app.use( express.urlencoded( { extended: true } ) )

  app.use(cors({origin:['*'],credentials:true}))
  
  const httpServer = http.createServer(app)
  httpServer.listen(PORT,()=>{
    console.log(`Server Run at http://localhost:${process.env.PORT}/graphql`);
  })
 apolloServer.applyMiddleware( { app, cors: false } )
}

main()