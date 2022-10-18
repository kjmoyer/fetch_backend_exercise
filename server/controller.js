const model = require('./model.js');

module.exports = {
  addTransaction: (req, res) => {
    model.addTransaction(req.body)
      .then(() => {
        console.log('success');
        res.status(201).send()
      })
      .catch((err) => {
        if (err.name === 'RangeError') {
          res.status(400).send(err);
        } else {
          console.log(err);
          res.status(500).send(err)
        }
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