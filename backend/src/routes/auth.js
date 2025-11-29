import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();
const users = [{ username: 'admin', password: bcrypt.hashSync('admin', 10), role: 'admin' }];

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Неверные данные' });

  const token = jwt.sign({ username, role: user.role }, 'secret', { expiresIn: '1d' });
  res.json({ token });
});

export default router;
