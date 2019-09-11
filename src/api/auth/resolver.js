import User from '../user/model'
import { notFound } from '../../services/response'
import { sign } from '../../services/jwt'

export default {
  Query: {
    authenticate: (parent, args, context) => {
      return User.findOne({ email: args.email })
        .then(notFound(context))
        .then(user => user.authenticate(args.password))
        .then(user => {
          if (user) {
            return {
              token: sign(user.id),
              user: user
            }
          }

          return new Error('401')
        })
    }
  }
}
