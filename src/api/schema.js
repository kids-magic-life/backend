import { mergeSchemas } from 'graphql-tools'
import UserSchema from './user'
import AuthSchema from './auth'
import ImageSchema from './image'

export default mergeSchemas({
  schemas: [
    UserSchema,
    AuthSchema,
    ImageSchema
  ]
})
