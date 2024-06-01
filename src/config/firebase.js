const admin = require('firebase-admin');
const serviceAccount = require('../fir-2b81a-firebase-adminsdk-gf4dp-68c1bedd39.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
