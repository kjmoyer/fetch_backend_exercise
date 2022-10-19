//-----DATA----
const transactions = [];
let accumulatedPoints = {};
let removedPoints = {};

//-----EXPORTED FUNCTIONS-----

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
  return 'Success';
}


async function getBalances() {
  let balances = {};
  for (payer in accumulatedPoints) {
    balances[payer] = accumulatedPoints[payer] - removedPoints[payer];
  }
  console.log('transactions', transactions);
  console.log('removedPoints', removedPoints);
  console.log('accumulatedPoints', accumulatedPoints);
  return balances;
}

async function spendPoints(points) {
  //determine total points
  let totalPoints = 0;
  const balances = await getBalances();
  for (payer in balances) {
    totalPoints += balances[payer];
  }
  if (totalPoints < points) {
    throw new RangeError('Not enough points to fulfill this request');
  }
  let response = [];
  let consumedPoints = {};
  let removed = { ...removedPoints };
  //helper func to store consumed points data for individual transactions
  const addPayerPoints = (payer, transPoints) => {
    let pointsToAdd = points - transPoints >= 0 ? transPoints : points;
    if (!consumedPoints[payer]) {
      consumedPoints[payer] = 0
    }
    consumedPoints[payer] += pointsToAdd;
    points -= pointsToAdd;
  }

  let i = 0;
  while (points > 0) { //this loop compares the current transaction points against removed points for that payer, in order of timestamp
    //skip over transactions that were negative point transactions
    if (transactions[i].points < 0) {
      i++;
      continue;
    } else if (removed[transactions[i].payer] === 0) {
      addPayerPoints(transactions[i].payer, transactions[i].points);
    } else if (removed[transactions[i].payer] >= transactions[i].points) {
      removed[transactions[i].payer] -= transactions[i].points;
    } else {
      addPayerPoints(transactions[i].payer, transactions[i].points - removed[transactions[i].payer]) //only passes in points remaining after removed points are accounted for
      removed[transactions[i].payer] = 0;
    }
    i++;
  }
  for (payer in consumedPoints) {
    response.push({ "payer": payer, "points": -consumedPoints[payer] })
    removedPoints[payer] += consumedPoints[payer];
  }
  return response;
}

// [
//   { "payer": "DANNON", "points": -100 },
//   { "payer": "UNILEVER", "points": -200 },
//   { "payer": "MILLER COORS", "points": -4,700 }
//]

//-----HELPER FUNCTIONS-----

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

module.exports = {
  addTransaction: addTransaction,
  getBalances: getBalances,
  spendPoints: spendPoints
};