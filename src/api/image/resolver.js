import _ from 'lodash'
import Image from './model'
import { notFound, isSelf } from '../../services/response'
import { createWriteStream } from 'fs'

const storeUpload = ({ createReadStream, filename }) =>
  new Promise((resolve, reject) =>
    createReadStream()
      .pipe(createWriteStream(filename))
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
    addImage: async (parent, args, context, { file }) => {
      console.log(args)
      const { createReadStream, filename } = await args.file
      await storeUpload({ createReadStream, filename })
      return true
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
