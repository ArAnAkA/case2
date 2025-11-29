import pg from 'pg';
export const pool = new pg.Pool({
user: 'postgres',
host: 'localhost',
database: 'cs2cases',
password: '1234',
port: 5432,
});
export default pool;
