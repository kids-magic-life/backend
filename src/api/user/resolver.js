import _ from 'lodash'
import User from './model'
import { notFound, isSelf } from '../../services/response'

export default {
  Query: {
    users: (parent, args, context) => {
      return User.find({ username: { $regex: args.username, $options: 'i' } })
        .then(users => users.map((user) => {
          const { Authorization } = context.services
          return user.view(Authorization.user.id == user._id)
        }))
        .catch(error => console.log(error))
    },
    user: (parent, args, context) => {
      return User.findById(args.id)
        .then(notFound(context))
        .then(user => {
          const { Authorization } = context.services
          return user.view(Authorization.user.id == user._id)
        })
        .catch(error => console.log(error))
    }
  },
  Mutation: {
    addUser: (parent, args) => {
      return new User(args).save()
    },
    updateUser: (parent, args, context) => {
      return User.findById(args.id)
        .then(notFound(context))
        .then(isSelf(context))
        .then(user => user ? _.merge(user, args).save() : null)
        .then(user => user ? user.view(true) : null)
    },
    removeUser: (parent, args, context) => {
      return User.findById(args.id)
        .then(notFound(context))
        .then(isSelf(context))
        .then(user => user ? user.remove() : null)
    }
  }
}
