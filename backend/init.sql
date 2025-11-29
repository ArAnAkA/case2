CREATE TABLE cases (
  id SERIAL PRIMARY KEY,
  name TEXT,
  description TEXT,
  price INTEGER,
  image_path TEXT
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  case_id INTEGER REFERENCES cases(id),
  name TEXT,
  rarity TEXT,
  chance FLOAT,
  price INTEGER
);
