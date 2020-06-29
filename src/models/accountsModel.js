const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
  agencia: {
    type: Number,
    required: true,
  },
  conta: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    validate(value) {
      if(value < 0) {
        throw new Error('Valor negativo não permitido');
      }
    }
  },
});

const accountsModel = mongoose.model('accounts', accountSchema)
module.exports = accountsModel;