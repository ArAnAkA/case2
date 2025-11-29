import jwt from 'jsonwebtoken';
export default function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Нет токена' });
  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, 'secret');
    next();
  } catch {
    res.status(401).json({ error: 'Недействительный токен' });
  }
}
