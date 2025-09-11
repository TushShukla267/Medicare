import express from 'express';
import cors from 'cors';
import connection from './Database.ts';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/roles', (req, res) => {
  connection.query('SELECT * FROM roles', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// npx ts-node src/Server.ts -> to run the server