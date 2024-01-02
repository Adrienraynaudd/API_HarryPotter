const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('./models/user');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { authenticateToken } = require('../middlewares/auth');
const app = express();
const port = process.env.PORT || 3000;
const ejsPath = require.resolve('ejs');
const ejsMainPath = require('path').dirname(ejsPath);

app.set('view engine', 'ejs');
app.set('views', ejsMainPath);

mongoose.connect('mongodb+srv://adrien:adrienadrien@cluster0.20qyxlc.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB :'));
db.once('open', () => {
  console.log('Connecté à la base de données MongoDB');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuration de la stratégie Google
passport.use(new GoogleStrategy({
  clientID: '9484950203-0chv63psg2br37oc2aua6m0s333khrg2.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'https://apiharrypotter.onrender.com/auth/google/callback',
},
(accessToken, refreshToken, profile, done) => {
  // Cette fonction sera appelée lorsqu'un utilisateur se connecte avec Google.
  // Vous pouvez ajouter votre logique pour enregistrer l'utilisateur dans la base de données ici.
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  // Serializez l'utilisateur (stockez l'ID de l'utilisateur dans la session)
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Récupérez l'utilisateur à partir de l'ID stocké dans la session
  done(null, id);
});

app.get('/', (req, res) => {
  res.render(path.join(__dirname, 'views', 'index'), { user: req.session.user });
});



// Routes pour la gestion des utilisateurs
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

// Routes pour la gestion des salles de classe
const classroomRoutes = require('./routes/classroom');
app.use('/classrooms', classroomRoutes);

app.get('/class', (req, res) => {
  res.render(path.join(__dirname, 'views', 'class'), { user: req.session.user });
});
// Routes pour l'authentification Google
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback après l'authentification avec Google
// La route pour la connexion via Google
app.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login'); // Redirigez vers la page de connexion en cas d'échec de l'authentification
    }

    // Stockez l'utilisateur dans la session
    console.log('User object:', user);
    const token = jwt.sign({ userId: user._id }, 'adrienadrien', { expiresIn: '1h' });
    req.session.user = user;
    req.session.token = token;
    // Redirigez l'utilisateur vers la page d'accueil
    return res.redirect('/');
  })(req, res, next);
});


// Routes pour l'authentification locale
app.get('/register', (req, res) => {
  res.render(path.join(__dirname, 'views', 'register'));
});

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      creationDate: new Date(),
      modificationDate: new Date(),
      creationUser: req.body.name,
      modificationUser: req.body.name,
      active: true,
    });

    await user.save();
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Erreur lors de l\'enregistrement de l\'utilisateur');
  }
});

app.get('/login', (req, res) => {
  res.render(path.join(__dirname, 'views', 'logins'));
});

app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const passwordMatch = await bcrypt.compare(req.body.password, user.password);

      if (passwordMatch) {
        // Utilisateur authentifié, générez un token JWT
        const token = jwt.sign({ userId: user._id }, 'adrienadrien', { expiresIn: '1h' });

        // Enregistrez le token dans la session côté serveur (en plus de la session côté client)
        req.session.user = user;
        req.session.token = token;

        // Répondez avec le token et redirigez l'utilisateur
        return res.status(200).json({ token });
      } else {
        // Mot de passe incorrect
        return res.status(401).json({ message: 'Mot de passe incorrect' });
      }
    } else {
      // Utilisateur non trouvé
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    // Erreur lors de la connexion
    console.error(error);
    return res.status(500).json({ message: 'Erreur lors de la connexion de l\'utilisateur' });
  }
});

// Route de déconnexion
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erreur lors de la déconnexion :', err);
      res.status(500).send('Erreur lors de la déconnexion');
    } else {
      res.redirect('/');
    }
  });
});

app.listen(port, () => {
  console.log(`Le serveur est en écoute sur le port ${port}`);
});
