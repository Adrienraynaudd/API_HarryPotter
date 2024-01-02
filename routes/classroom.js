const express = require('express');
const router = express.Router();
const ClassroomController = require('../controllers/classe');
const { authenticateToken } = require('../middlewares/auth');
// Route pour créer une salle de classe
router.post('/', ClassroomController.createClassroom);

// Route pour récupérer une salle de classe par ID
router.get('/:id', ClassroomController.getClassroom);

// Route pour mettre à jour une salle de classe par ID
router.put('/:id',authenticateToken, ClassroomController.updateClassroom);

// Route pour supprimer une salle de classe par ID
router.delete('/:id',authenticateToken, ClassroomController.deleteClassroom);

// Route pour récupérer la liste de toutes les salles de classe
router.get('/', ClassroomController.getClassroomList);

module.exports = router;
