import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', 
  password: 'your_mysql_password',
  database: 'library_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;