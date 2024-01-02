const User = require('../models/user');
const jwt = require('jsonwebtoken');
const secretKey = process.env.RANDOM_TOKEN_SECRET;
const UserController = {
  createUser: async (req, res) => {
    try {
      const { name, email, password, creationUser } = req.body;
      
      const newUser = new User({
        name,
        email,
        password,
        creationDate: new Date(),
        modificationDate: new Date(),
        creationUser,
        modificationUser: creationUser,
        active: true,
      });

      await newUser.save();

      logger.info({ 
        level: 'info',
        message: 'Utilisateur créé avec succès',
        timestamp: new Date().toISOString(),
        user: req.user ? req.user.email : 'Non authentifié',
        route: req.originalUrl
      });
    } catch (error) {
      // Utilisation du logger avec des informations supplémentaires en cas d'erreur
      logger.error({ 
        level: 'error',
        message: 'Erreur lors de la création de l\'utilisateur',
        err: error,
        timestamp: new Date().toISOString(),
        user: req.user ? req.user.email : 'Non authentifié',
        route: req.originalUrl
      });
      res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
    }
  },

    getAllUsers: async (req, res) => {
      try {
        const users = await User.find();
        res.status(200).json(users);
  
        // Utilisation du logger avec des informations supplémentaires
        logger.info({ 
          level: 'info',
          message: 'Liste des utilisateurs récupérée avec succès',
          timestamp: new Date().toISOString(),
          user: req.user ? req.user.email : 'Non authentifié',
          route: req.originalUrl
        });
      } catch (error) {
        // Utilisation du logger avec des informations supplémentaires en cas d'erreur
        logger.error({ 
          level: 'error',
          message: 'Erreur lors de la récupération des utilisateurs',
          err: error,
          timestamp: new Date().toISOString(),
          user: req.user ? req.user.email : 'Non authentifié',
          route: req.originalUrl
        });
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
      }
    },
  
    getUserById: async (req, res) => {
      try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
  
        if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
  
        res.status(200).json(user);
  
        // Utilisation du logger avec des informations supplémentaires
        logger.info({ 
          level: 'info',
          message: 'Utilisateur récupéré avec succès',
          timestamp: new Date().toISOString(),
          user: req.user ? req.user.email : 'Non authentifié',
          route: req.originalUrl
        });
      } catch (error) {
        // Utilisation du logger avec des informations supplémentaires en cas d'erreur
        logger.error({ 
          level: 'error',
          message: 'Erreur lors de la récupération de l\'utilisateur',
          err: error,
          timestamp: new Date().toISOString(),
          user: req.user ? req.user.email : 'Non authentifié',
          route: req.originalUrl
        });
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur' });
      }
    },
  
    updateUser: async (req, res) => {
      try {
        const userId = req.params.userId;
        const { name, email, modificationUser } = req.body;
  
        const user = await User.findByIdAndUpdate(
          userId,
          {
            name,
            email,
            modificationDate: new Date(),
            modificationUser,
          },
          { new: true } // Retourne le document mis à jour
        );
  
        if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
  
        res.status(200).json({ message: 'Utilisateur mis à jour avec succès', user });
  
        // Utilisation du logger avec des informations supplémentaires
        logger.info({ 
          level: 'info',
          message: 'Utilisateur mis à jour avec succès',
          timestamp: new Date().toISOString(),
          user: req.user ? req.user.email : 'Non authentifié',
          route: req.originalUrl
        });
      } catch (error) {
        // Utilisation du logger avec des informations supplémentaires en cas d'erreur
        logger.error({ 
          level: 'error',
          message: 'Erreur lors de la mise à jour de l\'utilisateur',
          err: error,
          timestamp: new Date().toISOString(),
          user: req.user ? req.user.email : 'Non authentifié',
          route: req.originalUrl
        });
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
      }
    },
  
    deleteUser: async (req, res) => {
      try {
        const userId = req.params.userId;
  
        const user = await User.findByIdAndDelete(userId);
  
        if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
  
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  
        // Utilisation du logger avec des informations supplémentaires
        logger.info({ 
          level: 'info',
          message: 'Utilisateur supprimé avec succès',
          timestamp: new Date().toISOString(),
          user: req.user ? req.user.email : 'Non authentifié',
          route: req.originalUrl
        });
      } catch (error) {
        // Utilisation du logger avec des informations supplémentaires en cas d'erreur
        logger.error({ 
          level: 'error',
          message: 'Erreur lors de la suppression de l\'utilisateur',
          err: error,
          timestamp: new Date().toISOString(),
          user: req.user ? req.user.email : 'Non authentifié',
          route: req.originalUrl
        });
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
      }
    },
    login: async (req, res) => {
      try {
        const { email, password } = req.body;
    
        const user = await User.findOne({ email: email, password: password });
        if (user) {
          const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '6h' });
          res.status(200).json({ token });
        } else {
          res.status(401).json({ message: 'Identifiants invalides' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la connexion' });
      }
    },
  };
  module.exports = UserController;