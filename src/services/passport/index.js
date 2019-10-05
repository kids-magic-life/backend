import User from '../../api/user/model'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import { verify } from '../jwt'
import passport from 'passport'

passport.use('bearer', new BearerStrategy((token, done) => {
  verify(token)
    .then(token => {
      User.findById(token.id)
        .then(user => user ? done(null, user.view(true)) : done(null, false))
        .catch(error => done(error, false))
    })
    .catch(error => done(error, false))
}))
