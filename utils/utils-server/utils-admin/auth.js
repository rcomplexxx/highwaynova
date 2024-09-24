import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.AUTH_SECRET // Replace with a strong secret key for JWT

function generateToken(userAdmin) {
  return jwt.sign({ userAdmin }, SECRET_KEY, { expiresIn: '1w' }); 
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded.userAdmin;
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
};