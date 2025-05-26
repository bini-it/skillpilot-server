import jwt from 'jsonwebtoken';

const verifyTokenFromQuery = (req, res, next) => {
  const token = req.query.token;

  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
  });
};
export default verifyTokenFromQuery;
