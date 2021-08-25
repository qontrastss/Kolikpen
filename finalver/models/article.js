const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const {
  JSDOM
} = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  hosts: {
    type: Number,
    required: true
  },
  mileage: {
    type: Number,
    required: true
  },

  markdown: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
})

articleSchema.pre('validate', function(next) {
  if (this.markdown) {
    this.slug = slugify(this.markdown, {
      lower: true,
      strict: true
    })
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
  }

  next()
})

module.exports = mongoose.model('Article', articleSchema)
