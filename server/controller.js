const model = require('./model.js');

module.exports = {
  addTransaction: (req, res) => {
    model.addTransaction(req.body)
      .then(() => {
        res.status(201).send()
      })
      .catch((err) => {
        res.status(501).send(err) //FIXME: refactor to send different codes for different reasons
      })
  },
  getBalances: (req, res) => {
    model.getBalances()
      .then((data) => {
        console.log()
        res.status(200).send(data);
      })
  }
}