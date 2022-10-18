
const transactions = [];
let accumulatedPoints = {};
let removedPoints = {};

async function addTransaction(transaction) {
  if (!accumulatedPoints[transaction.payer]) { //if this is a new payer, add to the payers object for tracking
    addPayer(transaction.payer);
  }
  if (transaction.points < 0) {
    return deduct(transaction.payer, -transaction.points, transaction)
  }
  //insert into the transaction array in order
  logTransaction(transaction);
  accumulatedPoints[transaction.payer] += transaction.points; //updates payer
  return 'Success'; //TODO: maybe change this
}

const addPayer = (payer) => {
  accumulatedPoints[payer] = 0;
  removedPoints[payer] = 0;
}

const logTransaction = (transaction) => {
  let timestamp = transaction.timestamp;
  if (transactions.length === 0) {
    transactions.push(transaction);
  } else {
    for (let i = 0; i <= transactions.length; i++) {
      if (i === transactions.length) {
        transactions.push(transaction);
        break;
      }
      console.log('timestamp comparison', transactions[i].timestamp >= timestamp);
      if (transactions[i].timestamp > timestamp) {
        transactions.splice(i, 0, transaction)
        break;
      }
    }
  }
}

const deduct = (payer, points, transaction) => {
  if (points > accumulatedPoints[payer]) {
    throw new RangeError('Not enough points for this transaction');
  }
  removedPoints[payer] += points;
  logTransaction(transaction);
};

async function getBalances() {
  let balances = {};
  for (payer in accumulatedPoints) {
    balances[payer] = accumulatedPoints[payer] - removedPoints[payer];
    console.log(balances[payer] = accumulatedPoints[payer] - removedPoints[payer]);
  }
  return balances;
}

module.exports = {
  addTransaction: addTransaction,
  getBalances: getBalances
};