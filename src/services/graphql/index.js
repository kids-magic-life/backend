import Context from './context'
import passport from 'passport'
import Authorization from './services/Authorization'

export default ({ request, response }) => {
  const context = new Context({ request, response })

  return new Promise((resolve, reject) => {
    const next = () => {
      resolve(context)
    }

    passport.authenticate('bearer', { session: false }, (err, user) => {
      context.services.Authorization = new Authorization(user)
      next()
    })(request, response, next)
  })
}
