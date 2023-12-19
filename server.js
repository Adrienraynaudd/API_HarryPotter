const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://127.0.0.1:27017/API', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB :'));
db.once('open', () => {
  console.log('Connecté à la base de données MongoDB');
});

app.use(bodyParser.json());

// Routes pour la gestion des utilisateurs
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

// Routes pour la gestion des salles de classe
const classroomRoutes = require('./routes/classroom');
app.use('/classrooms', classroomRoutes);

app.listen(port, () => {
  console.log(`Le serveur est en écoute sur le port ${port}`);
});
