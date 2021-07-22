const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(cors());

app.use(express.json());

const STATUS_200_OK = 200;
const STATUS_204_OK = 204;


const connection = mysql.createPool({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASS,
	database: process.env.MYSQL_DATABASE,
});

app.get('/movies/', async (req, res) => {
	const [rows] = await await connection.execute('SELECT `id`, `title`, `subtitle`, `storyline`, `rating`, `imagePath`, `bookmarked`, `genre` FROM movies');
	res.status(STATUS_200_OK).json(rows);
});

app.get('/movies/:id', async (req, res) => {
	const { id } = req.params;
	const [rows] = await connection.execute('SELECT * FROM movies WHERE id = ?', [id]);
	res.status(STATUS_200_OK).json(rows[0]);

});

app.post('/movies/', async (req, res) => {
	const { title, subtitle, storyline, rating, imagePath, bookmarked, genre } = req.body;
	const [result] = await connection.execute('INSERT INTO movies (`title`, `subtitle`, `storyline`, `rating`, `imagePath`, `bookmarked`, `genre`) VALUES (?, ?, ?, ?, ?, ?, ?)', [title, subtitle, storyline, rating, imagePath, bookmarked, genre]);
	res.status(STATUS_200_OK).json({ id: result.insertId, title, subtitle, storyline, rating, imagePath, bookmarked, genre });
});

app.put('/movies/:id', async (req, res) => {
	const { id } = req.params;
	console.log('passou aqui!');
	const { title, subtitle, storyline, rating, imagePath, bookmarked, genre } = req.body;
	await connection.execute('UPDATE movies SET `title` = ?, `subtitle` = ? , `storyline` = ?, `rating` = ?, `imagePath` = ?, `bookmarked` = ?, `genre` = ? WHERE id = ?', [title, subtitle, storyline, rating, imagePath, bookmarked, genre, id]);
	console.log('fez update');
	res.status(STATUS_204_OK).end();
});

app.delete('/movies/:id', async (req, res) => {
	const { id } = req.params;
	await connection.execute('DELETE FROM movies WHERE id = ?', [id]);
	res.status(STATUS_200_OK).end();
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`O BACK tá ON na porta ${PORT}`);
});
