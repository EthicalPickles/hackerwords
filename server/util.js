const jwt = require('jwt-simple');
const User = require('./users/userModel.js');


exports.getUsernameFromReq = (req, next) => {
  // recover username
  const token = req.headers['x-access-token'];
  if (!token) {
    next(new Error('No token'));
    return null;
  }
  const username = jwt.decode(token, 'secret').username;
  return username;
};

exports.getUserFromReq = (req, next) => {
  const username = exports.getUsernameFromReq(req, next);
  return User.findOne({ username });
};