const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const bodyParser = require('body-parser');
const ENV = require('./environment/environment');

const app = express();
app.use(compression());

// Construction de l'URL de connexion à MongoDB
const DB = `mongodb://localhost:27017/API`; // Remplacez 'your-database-name' par le nom de votre base de données

// Passby CORS errors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Connected to MongoDB with Success!');
}).catch((err) => {
    console.log('MongoDB ERROR', err);
});

app.use(bodyParser.json()); 

// ROUTES
const classroomRoutes = require('./routes/classroom');
app.use('/api/classrooms/', classroomRoutes);

module.exports = app;
