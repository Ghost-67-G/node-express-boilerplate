const admin = require('firebase-admin');
const serviceAccount = require('../fir-2b81a-firebase-adminsdk-gf4dp-68c1bedd39.json');

admin.initializeApp(
    process.env.NODE_DOMAIN === 'localhost'
        ? {
            credential: admin.credential.cert(serviceAccount),
            // databaseURL: 'https://env-ilmiya-dev-default-rtdb.firebaseio.com',
        }
        : {}
);



module.exports = admin;
