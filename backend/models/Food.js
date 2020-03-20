const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    unique: true
  },
  price: {
    type: Number,
    required: true,
  },
  kcal: {
    type: Number,
    required: true
  },
  recipe: {
    type: [String],
    required: true
  },
  ingredients: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient'
    }
  ]
})

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Food', schema)