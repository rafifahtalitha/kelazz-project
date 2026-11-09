import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Middleware untuk melindungi endpoint privat (harus melampirkan Bearer Token)
export function wajibLogin(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ pesan: 'Akses ditolak. Token diperlukan.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'kelazz-api',
      audience: 'kelazz-app',
      algorithms: ['HS256'],
    });

    req.user = payload; // Menyimpan data user (termasuk sub / ID) ke objek request
    next();
  } catch (e) {
    return res.status(401).json({
      pesan: e.name === 'TokenExpiredError' ? 'Token kedaluwarsa' : 'Token tidak valid',
    });
  }
}