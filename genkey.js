const { createKey } = require('json-crypto');

// Create a random encryption key
const key = createKey();

console.log("Your Key Is:", key)
