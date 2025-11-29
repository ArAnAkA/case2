import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import db from '../db.js';
import auth from '../middleware/auth.js';


const router = express.Router();
const storage = multer.diskStorage({
destination: (_, __, cb) => cb(null, path.join(process.cwd(), 'uploads')),
filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });


router.post('/cases/upload', auth, upload.single('image'), (req, res) => {
res.json({ path: `/uploads/${req.file.filename}` });
});


router.post('/cases', auth, async (req, res) => {
const { name, price, description, image_path } = req.body;
const { rows } = await db.query('INSERT INTO cases(name, price, description, image_path) VALUES($1,$2,$3,$4) RETURNING *', [name, price, description, image_path]);
res.json(rows[0]);
});


export default router;