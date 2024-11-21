const TransactionServices = require('../services/TransactionServices')


// ----------------- Transactions ------------------ //
exports.transaction = async (req, res) => {
    const whales = await TransactionServices.fetchWhaleTransfer();
    return res.status(200).json(whales);

}
