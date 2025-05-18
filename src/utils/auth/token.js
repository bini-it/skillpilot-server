import jwt from 'jsonwebtoken';

const generateRefreshToken = (payload) => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH secret is not defined');
  }
  return jwt.sign({ userId: payload.userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

const generateAccessToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET secret is not defined');
  }
  return jwt.sign(
    { userId: payload.userId, role: payload.role },
    process.env.JWT_SECRET,
    {
      expiresIn: '15m',
    }
  );
};

export { generateAccessToken, generateRefreshToken };
