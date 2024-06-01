const dotenv = require('dotenv');
const admin = require('../config/firebase');
const { getUser } = require('../services/firebase/user.firebase');
const userService = require('../services/user.service');
const { roleRights } = require('../config/roles');

dotenv.config();

const validateAccessToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Missing or invalid Authorization header.' });
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const claims = await admin.auth().verifyIdToken(idToken);
    req.auth = claims;
    let user = await userService.getUserById(req.auth.sub);

    if (!user) {
      const _user = await getUser(req.auth.sub);
      user = await userService.createUser({
        _id: _user.user_id || _user.uid,
        photoURL: _user.photoURL,
        address: _user.Address,
        displayName: _user.displayName,
        given_name: _user.displayName.split(' ')[0],
        family_name: _user.displayName.split(' ')[1],
        username: _user.email.split('@')[0],
        email: _user.email,
        phone_number: _user.phoneNumber,
        role: 'user',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error validating access token:', error);
    return res.status(401).json({ error: 'Unauthorized. Invalid access token.' });
  }
};

const checkRights = (requiredRights) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Forbidden. Missing or invalid user role.' });
    }

    const userRights = roleRights.get(req.user.role) || [];
    const hasRequiredRights = requiredRights.every((right) => userRights.includes(right));

    if (!hasRequiredRights) {
      return res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
    }

    next();
  };
};

module.exports = {
  validateAccessToken,
  checkRights,
};
