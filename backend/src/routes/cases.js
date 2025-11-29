import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const r = await db.query('SELECT * FROM cases');
  res.json(r.rows);
});

router.get('/:id', async (req, res) => {
  const r = await db.query('SELECT * FROM cases WHERE id=$1', [req.params.id]);
  const items = await db.query('SELECT * FROM items WHERE case_id=$1', [req.params.id]);
  res.json({ case: r.rows[0], items: items.rows });
});

router.post('/:id/open', async (req, res) => {
  const items = await db.query('SELECT * FROM items WHERE case_id=$1', [req.params.id]);
  if (!items.rows.length) return res.status(404).json({ error: 'Нет предметов' });
  const totalChance = items.rows.reduce((a, i) => a + i.chance, 0);
  let roll = Math.random() * totalChance;
  for (const i of items.rows) {
    roll -= i.chance;
    if (roll <= 0) return res.json({ item: i });
  }
  res.json({ item: items.rows[0] });
});

export default router;
