To use the optimized `Store` class for interacting with Redis, follow these steps:

1. Make sure you have the necessary Redis configuration in your `config.js` file. For example, define the `REDIS_URL` constant with the URL of your Redis server.

2. Import the `Store` class in your application:

   ```javascript
   import Store from './path/to/store.js';
   ```

3. Use the `Store` class methods to interact with Redis. For example:

   ```javascript
   // Storing JSON data
   const jsonData = { key1: 'value1', key2: 'value2' };
   await Store.jsonStore('jsonKey', jsonData);

   // Retrieving JSON data
   const retrievedJsonData = await Store.jsonGet('jsonKey');
   c

   // Storing a string
   const stringData = 'Hello, Redis!';
   await Store.stringStore('stringKey', stringData);

   // Retrieving a string
   const retrievedStringData = await Store.stringGet('stringKey');
   console.log(retrievedStringData);
   ```

   In this example, we store and retrieve JSON data and a string using the corresponding methods of the `Store` class. The `await` keyword is used to wait for the asynchronous operations to complete, and the results are logged to the console.

By utilizing the optimized `Store` class, you can interact with Redis efficiently and ensure proper connection handling without the need to explicitly manage connections in your application code.
