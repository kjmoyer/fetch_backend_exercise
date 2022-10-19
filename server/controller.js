const model = require('./model.js');

module.exports = {
  addTransaction: (req, res) => {
    model.addTransaction(req.body)
      .then(() => {
        res.status(201).send()
      })
      .catch((err) => {
        if (err.name === 'RangeError') {
          res.status(400).send(err);
        } else {
          res.status(500).send(err)
        }
      })
  },
  spendPoints: (req, res) => {
    model.spendPoints(req.body.points)
      .then((response) => {
        res.status(200).send(response)
      })
      .catch((err) => {
        if (err.name === 'RangeError') {
          res.status(400).send(err);
        } else {
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
      .catch((err) => {
        res.status(500).send(err);
      })
  }
}