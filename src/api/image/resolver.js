import _ from 'lodash'
import Image from './model'
import mongoose from 'mongoose'
import { notFound, isSelf } from '../../services/response'
import { createWriteStream } from 'fs'
import { ip, port } from '../../config'

const storeUpload = ({ createReadStream, name }) =>
  new Promise((resolve, reject) =>
    createReadStream()
      .pipe(createWriteStream('images/gallery/' + name))
      .on('finish', () => resolve())
      .on('error', reject)
  )

export default {
  Query: {
    images: (parent, args, context) => {
      return Image.find({})
        .then(images => images.map(image => image.view(true)))
        .catch(error => console.log(error))
    },
    image: (parent, args, context) => {
      return Image.findById(args.id)
        .then(notFound(context))
        .then(image => image.view(true))
        .catch(error => console.log(error))
    }
  },
  Mutation: {
    addImage: async (parent, args, context) => {
      const { createReadStream, mimetype } = await args.file
      const name = new mongoose.Types.ObjectId().toString() + '.' + mimetype.split('/')[1]
      let image = null

      await storeUpload({ createReadStream, name }).then(() => {
        image = new Image({
          title: args.title,
          description: args.description,
          location: ip + ':' + port + '/' + name
        }).save()
      })

      return image
    },
    updateImage: (parent, args, context) => {
      return Image.findById(args.id)
        .then(notFound(context))
        .then(isSelf(context))
        .then(image => (image ? _.merge(image, args).save() : null))
        .then(image => (image ? image.view(true) : null))
    },
    removeImage: (parent, args, context) => {
      return Image.findById(args.id)
        .then(notFound(context))
        .then(isSelf(context))
        .then(image => (image ? image.remove() : null))
    }
  }
}
