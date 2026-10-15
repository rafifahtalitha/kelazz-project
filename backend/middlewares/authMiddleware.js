import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ pesan: 'Akses ditolak. Token tidak ditemukan.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'rahasia_jwt_kelazz_123'
    );
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ pesan: 'Token tidak valid atau telah kedaluwarsa.' });
  }
}