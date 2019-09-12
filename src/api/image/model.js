import mongoose, { Schema } from 'mongoose'

const model = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    file: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

model.methods = {
  view (full) {
    const view = {
      id: this.id,
      title: this.title,
      description: this.description,
      file: this.file,
      location: this.location,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full
      ? {
        ...view
      }
      : view
  }
}

const image = mongoose.model('Image', model)

export const schema = image.schema
export default image
