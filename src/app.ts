import 'reflect-metadata'
import {useKoaServer} from "routing-controllers"
import * as Koa from 'koa'

const app = new Koa()

useKoaServer(app,{
  cors: true,
  controllers: [
    //
  ]
})

export default app
