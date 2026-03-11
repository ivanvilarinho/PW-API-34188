const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Mock data
let movies = [
  { id: 1, title: "Inception", year: 2010 },
  { id: 2, title: "Interstellar", year: 2014 }
];

// --- USERS ROUTES (já existentes) ---
app.get("/users", (req, res) => {
  res.status(200).json({ message: "OK - GET users" });
});

app.post("/users", (req, res) => {
  res.status(200).json({ message: "OK - POST users" });
});

app.put("/users/:id", (req, res) => {
  res.status(200).json({ message: "OK - PUT users" });
});

app.delete("/users/:id", (req, res) => {
  res.status(200).json({ message: "OK - DELETE users" });
});

// --- MOVIES ROUTES ---

// GET /movies - retorna todas
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

// GET /movies/:id - retorna um filme pelo ID
app.get("/movies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.id === id);
  if (!movie) return res.status(404).json({ error: "Movie not found" });
  res.status(200).json(movie);
});

// POST /movies - cria um novo filme
app.post("/movies", (req, res) => {
  const { title, year } = req.body;
  if (!title || !year) return res.status(400).json({ error: "Title and year are required" });

  const newMovie = {
    id: movies.length ? movies[movies.length - 1].id + 1 : 1,
    title,
    year
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// PUT /movies/:id - atualiza um filme pelo ID
app.put("/movies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, year } = req.body;
  const movieIndex = movies.findIndex(m => m.id === id);

  if (movieIndex === -1) return res.status(404).json({ error: "Movie not found" });
  if (!title && !year) return res.status(400).json({ error: "Title or year is required to update" });

  if (title) movies[movieIndex].title = title;
  if (year) movies[movieIndex].year = year;

  res.status(200).json(movies[movieIndex]);
});

// DELETE /movies/:id - remove um filme pelo ID
app.delete("/movies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const movieIndex = movies.findIndex(m => m.id === id);
  if (movieIndex === -1) return res.status(404).json({ error: "Movie not found" });

  const deletedMovie = movies.splice(movieIndex, 1);
  res.status(200).json({ message: "Movie deleted", movie: deletedMovie[0] });
});

// --- START SERVER ---
const PORT = process.env.SERVER_PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
