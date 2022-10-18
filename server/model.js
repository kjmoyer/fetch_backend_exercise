
const transactions = [];
const payers = {};

async function addTransaction(transaction)  {
  console.log(transaction);
  if (!payers[transaction.payer]) { //if this is a new payer, add to the payers object for tracking
    addPayer(transaction.payer);
  } else if (transaction.points < 0) {
    return deduct(transaction.payer, transaction.points);
  }
  transaction.pointsAvailable = transaction.points; //this element can be altered without modifying the original transaction amounts
  transactions.push(transaction);
  payers[transaction.payer] = payers[transaction.payer] + transaction.points;
  console.log(transactions);
  console.log(payers);
  return true; //TODO: maybe change this
}

const addPayer = (payer) => {
  payers[payer] = 0;
}

const deduct = (payer, points) => { //FIXME: finish this
  if (points > payers[payer]) {
    return new RangeError('Not enough points for this transaction');
  }
  //find the oldest transaction for that payer
  //attempt to remove all available points
    //if points to remove is <= the amount of points in that transaction
      //remove those points from payer's total
      //alter this
};

module.exports = {
  addTransaction: addTransaction,
  addPayer: addPayer
};