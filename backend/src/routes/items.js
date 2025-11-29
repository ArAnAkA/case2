import express from 'express';
import db from '../db.js';
const router = express.Router();

router.post('/', async (req, res) => {
  const { case_id, name, rarity, chance, price } = req.body;
  const r = await db.query('INSERT INTO items(case_id,name,rarity,chance,price) VALUES($1,$2,$3,$4,$5) RETURNING *',
    [case_id, name, rarity, chance, price]);
  res.json(r.rows[0]);
});

export default router;
