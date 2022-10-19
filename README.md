# fetch_backend_exercise
```diff
+OVERVIEW:
```
This service accepts HTTP request for transactions to store, use, and query a user's reward points.

```diff
+API ROUTES:
```
Requests should be made to localhost on port 3000, with the listed JSON arguments in the request ```body```

ADD NEW TRANSACTION
  type: POST
  endpoint: /transactions
  body-argument: {
    payer: <string>
    points: <integer>
    timestamp: <UTC date>
  }

SPEND/CONSUME POINTS
  type: PUT
  endpoint: /spend
  body-argument: {
    points: <integer>
  }

GET ALL POINT BALANCES BY PAYER:
  type: GET
  endpoint: /balances

```diff
+HOW-TO:
```
 1. To start the server, from the root folder, run `npm run start`.

2. Send HTTP requests from your local computer as outlined above.

```diff
+DATA LOGIC:
```
  
All data is being stored in memory in the model.js file.

```Transactions``` are being stored in an array, and are entered in chronologically at insertion.

All transactions are stored here including any transactions that have a negative point value.

Each element contains the payer, points, and a timestamp.

Transactions are never altered or removed once entered for reporting integrity.


```AccumulatedPoints``` is an object that stores the total number of points ever accumulated separated by payer.

Each key is the name of a single payer, with a value equal to the points ever accumulated for that payer

```removedPoints``` has the same structure as accumulatedPoints, but keeps track of all points ever removed or used for each payer.

These values include points removed from a transaction with a negative point value, or points that are used by the user.

These values are used to know how many points should be 'ignored' in two ways:
  1. When calculating the total balance of points per each payer
  2. When a user consumes points. the amount of 'removed points' per payer will be ignored as the transactions are evaluated chronologically by looping across the transactions array.



