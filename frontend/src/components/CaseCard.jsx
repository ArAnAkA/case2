import React from 'react';
import { Link } from 'react-router-dom';

export default function CaseCard({ cs }) {
  return (
    <div className="bg-gray-800 text-white p-3 rounded-lg shadow hover:scale-105 transition">
      <img src={cs.image_path} alt={cs.name} className="rounded mb-2 w-full" />
      <h3 className="text-lg">{cs.name}</h3>
      <p>{cs.price} ₽</p>
      <Link to={`/case/${cs.id}`} className="text-blue-400">Открыть</Link>
    </div>
  );
}
