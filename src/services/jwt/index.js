import jwt from 'jsonwebtoken'
import Promise from 'bluebird'
import { AuthenticationError } from 'apollo-server-koa'
import { jwtSecret } from '../../config'

const jwtSign = Promise.promisify(jwt.sign)
const jwtVerify = Promise.promisify(jwt.verify)

export const sign = (id, options, method = jwtSign) =>
  method({ id }, jwtSecret, options)

export const signSync = (id, options) => sign(id, options, jwt.sign)

export const verify = (token) => jwtVerify(token, jwtSecret, (error, token) => {
  if (error) {
    throw new AuthenticationError('Invalid access_token')
  }

  return token
})
