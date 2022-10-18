const express = require('express');
const morgan = require('morgan');
const model = require('model.js');

const app = express();
app.use(morgan);
app.use(express.json());

app.put('/transaction', (req, res) => {
  model.addTransaction()
}) //for new transactions

app.put('/spend',() => {

} ) //spend points

app.get('/balance', () => {

}) //get point balances

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});