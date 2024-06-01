const dotenv = require('dotenv');
const admin = require('../config/firebase.js');
const { User } = require('../models');
const { getUser } = require('../services/firebase/user.firebase');
const userService = require('../services/prisma/users');
dotenv.config();
const _token = process.env._token;

const validateAccessToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Missing or invalid Authorization header.' });
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const claims = await admin.auth().verifyIdToken(idToken);
    req.auth = claims;
    if (claims.firebase.tenant) {
      req.headers['tenant-id'] = claims.firebase.tenant;
    }
    const tenantId = req.headers['tenant-id'];
    if (tenantId) {
      req.auth.org_id = tenantId;
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};
// Middleware function to validate the scope of the JWT token
function checkScope(scopes, operator = 'AND') {
  return (req, res, next) => {
    const payload = req.auth;
    next();
  };
}
const fetchUser = async (req, res, next) => {
  try {
    const user = await userService.read(req.auth.sub);
    if (!user) {
      const _user = await getUser(req.auth.sub, req.auth?.firebase?.tenant);
      try {
        const createdUser = await userService.createItem({
          user_id: _user['user_id'] || _user['uid'],
          photoURL: _user.photoURL,
          Address: _user.Address,
          displayName: _user.displayName,
          given_name: _user.displayName.split(' ')[0],
          family_name: _user.displayName.split(' ')[1],
          username: _user.email.split('@')[0],
          tenantId: _user.tenantId,
          email: _user.email,
          phone_number: _user.phoneNumber,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        req.user = createdUser;
      } catch (error) {
        console.log('Error creating user:', error);
        if (error.code === 11000) {
          if (error.message.includes('user_id')) {
            console.log('Duplicate user_id error');
            const user = await User.findOne({ user_id: req.auth.sub });
            req.user = user;
            next();
            return;
          }
        }
      }

      next();
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error?.message ?? 'Server error' });
  }
};

module.exports = {
  validateAccessToken,
  fetchUser,
  checkScope,
  _token,
};
