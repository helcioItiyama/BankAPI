const express = require('express');
const router = require('./routes/accountsRoute');
const mongoose = require('mongoose');

(async () => {
  try{
    await mongoose.connect("mongodb+srv://helcio:<password>@bootcamp.yxdbm.mongodb.net/BankApi?retryWrites=true&w=majority", {
      useNewUrlParser: true, 
      useUnifiedTopology: true
    });
  } catch(err) {
    console.log('Erro ao conectar ao MongoDB Atlas' + err)
  }
})();

const app = express();
app.use(express.json());
app.use('/accounts', router);

app.listen(3000, () => console.log('API funcionando'));