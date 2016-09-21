# leveldowniteratorgarbage
Test program for leveldown iterator memory usage

## Run the inserter
```javascript
node index.js 1
```
will insert `1e6` records into the test database `test.db`. After that, the program will stay idle and wait for you to attach the `mdb` and list `::jsfunctions`.


## Run the picker
```javascript
node index.js 2
```
will:

1. Choose a random number in the [1, 1e6] range
2. Create a readStream on `test.db`
3. Iterate all the records
4. If a record matches, it will be push-ed to a global array
5. In 5 seconds, go back to step 1.



