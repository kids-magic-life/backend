import Koa from 'koa'
import cors from '@koa/cors'
import mount from 'koa-mount'
import graphql from '../graphql'
import { graphqlUploadKoa } from 'graphql-upload'
import '../passport'
import passport from 'passport'

export default () => {
  const app = new Koa()

  app.use(cors())
  app.use(mount(graphql()))
  app.use(passport.initialize())
  app.use(graphqlUploadKoa({ maxFileSize: 10000000, maxFiles: 8 }))

  return app
}
