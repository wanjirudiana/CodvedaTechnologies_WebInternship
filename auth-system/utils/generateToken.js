const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  // Create token payload (data we want to store in token)
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email
  };

  // Sign token with secret and set expiration
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

module.exports = generateToken;