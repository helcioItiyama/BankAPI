const express = require('express');
const router = express.Router();
const AccountsController = require('../controllers/AccountsController');

router.get('/', AccountsController.list);
router.get('/balance', AccountsController.balance);
router.get('/average', AccountsController.averageBalance);
router.get('/poorest', AccountsController.poorestAccounts);
router.get('/richest', AccountsController.richestAccounts);


router.patch('/deposit', AccountsController.deposit);
router.patch('/withdraw', AccountsController.withdraw);
router.patch('/transfer', AccountsController.transfer);
router.patch('/premium', AccountsController.premiumAccounts);

router.delete('/', AccountsController.delete);


module.exports = router;