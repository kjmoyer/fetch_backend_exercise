const express = require('express');
const morgan = require('morgan');
const controller = require('./controller.js');
const app = express();
app.use(express.json());

app.post('/transaction', (req, res) => {
  controller.addTransaction(req, res)
}) //for new transactions

// app.put('/spend',(req, res) => {

// } ) //spend points

app.get('/balances', (req, res) => {
  controller.getBalances(req, res);
}) //get point balances

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});