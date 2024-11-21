const express = require('express')
const router = express.Router()
const TransactionController = require('../controllers/TransactionController')



// transaction
router.get('/transaction', TransactionController.transaction)

module.exports = router;