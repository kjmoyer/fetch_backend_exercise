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
  return 'Success'; //TODO: maybe change this
}


async function getBalances() {
  let balances = {};
  for (payer in accumulatedPoints) {
    balances[payer] = accumulatedPoints[payer] - removedPoints[payer];
  }
  console.log('transactions', transactions);
  return balances;
}

async function spendPoints(points) {
  //determine total points
  console.log(points);
  let totalPoints = 0;
  const balances = await getBalances();
  for (payer in balances) {
    totalPoints += balances[payer];
  }
  //if total points < requested points send an error
  if (totalPoints < points) {
    throw new Error('Not enough points to fulfill this request');
  }
  //create an array to hold the response objects
  let response = [];
  //create a temp object to hold all payers/points to be consumed
  let consumedPoints = {};
  //make a copy of the removed points object
  let removed = { ...removedPoints };
  const addPayerPoints = (payer, transPoints) => {
    console.log('payer', payer);
    console.log('transPoints', transPoints);
    let pointsToAdd = points - transPoints >= 0 ? transPoints : points;
    if (!consumedPoints[payer]) {
      consumedPoints[payer] = 0
    }
    consumedPoints[payer] += pointsToAdd;
    points -= pointsToAdd;
  }
  //loop through transactions
  let i = 0;
  while (points > 0) {
    console.log('points ', points);
    console.log('transaction, ', transactions[i]);
    console.log('removed ', removed);
    //if the removed points for that payer is 0
    //add the payer to the holder object if it's not there
    //increment their points to be used
    //decrement totalpoints to be consumed
    if (transactions[i].points < 0) {
      i++;
      continue;
    } else if (removed[transactions[i].payer] === 0) {
      addPayerPoints(transactions[i].payer, transactions[i].points);
      //else if removed points >= current transaction's points
      //decrement removed points for that payer by current transaction's points
    } else if (removed[transactions[i].payer] >= transactions[i].points) {
      removed[transactions[i].payer] -= transactions[i].points;

      //else
      //add the payer to the holder object if it's not there
      //increment their points to be used by transaction points - removedpoints remaining
      //decrement totalpoints to be consumed by transaction points - removedpoints remaining
      //set removed points for that payer to 0;
    } else {
      addPayerPoints(transactions[i].payer, transactions[i].points - removed[transactions[i].payer]) //only passes in points remaining after removed points are accounted for
      removed[transactions[i].payer].points = 0; //FIXME: doesn't seem to be setting this to 0
    }
    i++;
  }
  for (payer in consumedPoints) {
    response.push({ "payer": payer, "points": -consumedPoints[payer] })
    //TODO: add these amounts to actual removed values
  }
  //for each key in the temp object, push it's values into the return array
  console.log('response ', response);
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