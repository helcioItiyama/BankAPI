const accountsModel = require('../models/accountsModel');

module.exports = {
  async list(req, res) {
    try {
      const accounts = await accountsModel.find({});
      res.send(accounts);

    } catch(err) {
      res.status(500).send(err);
    }
  },

  async deposit(req, res) {
    try{
      const { agencia, conta, deposit } = req.body;
      const accounts = await accountsModel.findOne({agencia, conta});
      
      if(!accounts) {
        res.status(400).send('Conta não encontrada');
      }

      if(deposit < 0) {
        res.status(400).send('Valor inválido');
      } 

      accounts.balance += deposit;
      const { balance } = accounts;
      await accounts.save();
      res.send({ balance });
  
    } catch(err) {
      res.status(500).send(err);
    }
  },

  async withdraw(req, res) {
    try {
      const fee = 1;
      const { agencia, conta, withdraw } = req.body;
      const accounts = await accountsModel.findOne({agencia, conta});

      if(!accounts) {
        res.status(400).send('Conta não encontrada');
      }
      
      if(withdraw + fee > accounts.balance) {
        res.status(400).send('Saldo insuficiente')
      }

      accounts.balance -= withdraw + fee;
      const { balance } = accounts;
      await accounts.save();
      res.send({ balance });

    } catch(err) {
      res.send(500).send(err)
    }
  },

  async balance(req, res) {
    try{
      const { agencia, conta } = req.body;
       
      const accounts = await accountsModel.findOne({agencia, conta});
   
      if(!accounts) {
        res.status(400).send('Conta não encontrada');
      }

      const { balance } = accounts;
      res.send({ balance });
  
    } catch(err) {
      res.status(500).send(err);
    }
  },

  async delete(req, res) {
    try{
      const { agencia, conta } = req.body;

      const accounts = await accountsModel.findOneAndDelete({agencia, conta});

      if(!accounts) {
        res.status(400).send('Conta não encontrada');
      };
      
      const agencies = await accountsModel.find({agencia});
      const total = agencies.length;
      res.send({total});
  
    } catch(err) {
      res.status(500).send(err);
    }
  },

  async transfer(req, res) {
    try { 
      const { sourceAccount, destinationAccount, transferValue } = req.body;
      const fee = 8;

      const source = await accountsModel.findOne({conta: sourceAccount});
      if(!source) {
        res.status(400).send('Conta de origem não encontrada');
      }

      const destination = await accountsModel.findOne({conta: destinationAccount});
      if(!destination) {
        res.status(400).send('Conta destino não encontrada');
      }

      if(source.agencia !== destination.agencia) {
        source.balance -= transferValue + fee;
      } else {
        source.balance -= transferValue;
      }

      destination.balance += transferValue;
      await destination.save();
      await source.save();

      res.send({balance: source.balance});

    } catch(err) {
      res.status(500).send(err);
    }
  },

  async averageBalance(req, res) {
    try {
      const { agencia } = req.body;

      const accounts = await accountsModel.find({agencia});

      const totalValue = accounts.reduce((total, account) => {
        return total += account.balance
      }, 0);

      const average = totalValue / accounts.length;
      res.send({average: average})

    } catch(err) {
      res.status(500).send(err);
    }
  },

  async poorestAccounts(req, res) {
    try {
      const { accountsNumber } = req.body;

      const poorestAccounts = await accountsModel.find()
        .limit(accountsNumber)
        .sort({balance:1, agencia:1, conta:1});

      const accounts = poorestAccounts.map(account => ({
        agencia: account.agencia, 
        conta: account.conta, 
        balance: account.balance
      }))

      res.send(accounts);

    } catch(err) {
      res.status(500).send(err);
    }
  },

  async richestAccounts(req, res) {
    try {
      const { accountsNumber } = req.body;

      const richestAccounts = await accountsModel.find()
        .limit(accountsNumber)
        .sort({balance:-1, name: 1});

      res.send(richestAccounts);

    } catch(err) {
      res.status(500).send(err);
    }
  },

  async premiumAccounts(req, res) {
    try {
      const accounts = await accountsModel.find();

      const findAgencies = accounts.reduce((agencies, bank) => {
        if(!agencies.includes(bank.agencia)) {
          agencies.push(bank.agencia)
        }
        return agencies;
      }, []);

      const premiumAccounts = [];

      for(agency of findAgencies) {
        const [richestAccounts] = await accountsModel
          .find({agencia:agency})
          .limit(1)
          .sort({balance:-1});

        richestAccounts.agencia = 99;
        await richestAccounts.save()
        premiumAccounts.push(richestAccounts);
      }
      
      res.send(premiumAccounts);
    } catch(err) {
      res.status(500).send(err);
    }
  }
}
