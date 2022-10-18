
const transactions = [];
const payerBalances = {};

async function addTransaction(transaction)  {
  if (!payerBalances[transaction.payer]) { //if this is a new payer, add to the payers object for tracking
    addPayer(transaction.payer);
  }
  if (transaction.points < 0) {
    return deduct(transaction.payer, -transaction.points);
  }
  transaction.pointsAvailable = transaction.points; //this element can be altered without modifying the original transaction amounts
  transactions.push(transaction); //adds transaction
  payerBalances[transaction.payer] += transaction.points; //updates payer
  return 'Success'; //TODO: maybe change this
}

const addPayer = (payer) => {
  payerBalances[payer] = 0;
}

const deduct = (payer, points) => { //FIXME: finish this
  console.log('transactions', transactions)
  if (points > payerBalances[payer]) {
    return new RangeError('Not enough points for this transaction');
  }
  //find the oldest transaction for that payer
  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].payer === payer && transactions[i].pointsAvailable >= points) { //right payer and enough points
      console.log('points', points);
      transactions[i].pointsAvailable -= points;
      payerBalances[payer] -= points;
      console.log('balances', payerBalances);
      return 'Success';
    } else if (transactions[i].payer === payer) { //right payer, not enough points
      points -= transactions[i].pointsAvailable;
      payerBalances[payer] -= transactions[i].pointsAvailable;
      transactions[i].pointsAvailable = 0;
    }
  }
};

async function getBalances() {
  return payerBalances;
}

module.exports = {
  addTransaction: addTransaction,
  getBalances: getBalances
};