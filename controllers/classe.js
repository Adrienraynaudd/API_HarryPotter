const Classroom = require('../models/classroom');
const axios = require('axios');
const logger = require('../logger');

// Fonction pour sélectionner aléatoirement plusieurs éléments d'un tableau
function getRandomElements(array, count) {
    // Assurez-vous que le tableau n'est pas vide
    if (array.length === 0) {
      return []; // ou une autre valeur par défaut
    }
  
    // Sélectionnez un index aléatoire dans la plage du tableau pour chaque élément requis
    const randomIndices = Array.from({ length: count }, () => Math.floor(Math.random() * array.length));
  
    // Retournez les noms correspondants aux indices aléatoires
    return randomIndices.map(index => array[index].name);
  }
  

// Fonction pour sélectionner aléatoirement un élément d'un tableau
function getRandomElement(array) {
    // Assurez-vous que le tableau n'est pas vide
    if (array.length === 0) {
      return null; // ou une autre valeur par défaut
    }
  
    // Sélectionnez un index aléatoire dans la plage du tableau
    const randomIndex = Math.floor(Math.random() * array.length);
  
    // Retournez le nom de l'étudiant correspondant à l'index aléatoire
    return array[randomIndex].name;
  }
  

exports.createClassroom = async (req, res) => {
  try {
    // Récupération des informations sur les étudiants, les enseignants et les sorts depuis l'API externe
    const [studentsResponse, teachersResponse, spellsResponse] = await Promise.all([
      axios.get('https://hp-api.onrender.com/api/characters/students'),
      axios.get('https://hp-api.onrender.com/api/characters/staff'),
      axios.get('https://hp-api.onrender.com/api/spells'),
    ]);

    // Supposons que les réponses contiennent des données sous forme de tableaux
    const students = studentsResponse.data;
    const teachers = teachersResponse.data;
    const spells = spellsResponse.data;

    // Sélection aléatoire d'étudiants, d'un enseignant et d'un sort pour la salle de classe
    const randomStudentNames = getRandomElements(students, 30);
const randomTeacher = getRandomElement(teachers);
const randomSpell = getRandomElement(spells);

// Vérification que les enseignant et sort sont définis
if (!randomTeacher || !randomSpell) {
  // Gérer le cas où l'enseignant ou le sort n'est pas défini
  return res.status(500).json({ message: 'Erreur lors de la création de la salle de classe. Enseignant ou sort manquant.' });
}

// Construction de l'objet représentant la salle de classe
const classroomData = {
  students: randomStudentNames,
  teacher: randomTeacher,
  spell: randomSpell,
  creationDate: new Date(),
  modificationDate: new Date(),
  creationUser: 'admin',
  modificationUser: 'admin',
  active: true,
};

// Création de la salle de classe dans la base de données
const classroom = new Classroom(classroomData);
const savedClassroom = await classroom.save();

// ...


    res.status(200).json({ message: 'Création de la salle de classe bien réalisée', classroom: savedClassroom });
    logger.info({ message: 'Salle de classe bien créée' });
  } catch (error) {
    logger.error({ message: 'Erreur lors de la création de la salle de classe', err: error });
    res.status(500).json({ message: 'Erreur lors de la création de la salle de classe.', err: error });
  }
};

exports.getClassroom = async (req, res) => {
  try {
    const id = req.params.id;
    const classroom = await Classroom.findById(id);

    if (!classroom) {
      logger.error({ message: 'Salle de classe introuvable pour cet id' });
      return res.status(404).json({ message: 'Pas de salle de classe trouvée pour cet id' });
    }

    logger.info({ message: 'Salle de classe bien renvoyée' });
    res.status(200).json(classroom);
  } catch (error) {
    logger.error({ message: 'Erreur lors de la récupération de la salle de classe', err: error });
    res.status(500).json({ message: 'Erreur lors de la récupération de la salle de classe.', err: error });
  }
};

exports.updateClassroom = async (req, res) => {
  try {
    const id = req.params.id;
    req.body.modificationDate = new Date();

    const updatedClassroom = await Classroom.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedClassroom) {
      logger.error({ message: 'Salle de classe introuvable pour la mise à jour' });
      return res.status(404).json({ message: 'Erreur lors de la mise à jour de la salle de classe, vérifier le body' });
    }

    logger.info({ message: 'Salle de classe bien mise à jour' });
    res.status(200).json({ message: 'Modification de la salle de classe réussie', classroom: updatedClassroom });
  } catch (error) {
    logger.error({ message: 'Erreur lors de la mise à jour de la salle de classe', err: error });
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la salle de classe.', err: error });
  }
};

exports.deleteClassroom = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Classroom.findByIdAndDelete(id);

    if (!result) {
      logger.error({ message: 'Salle de classe introuvable pour la suppression' });
      return res.status(404).json({ message: 'Cette salle de classe n\'existe pas' });
    }

    logger.info({ message: 'Salle de classe bien supprimée' });
    res.status(200).json({ message: 'Suppression de la salle de classe réussie' });
  } catch (error) {
    logger.error({ message: 'Erreur lors de la suppression de la salle de classe', err: error });
    res.status(500).json({ message: 'Erreur lors de la suppression de la salle de classe.', err: error });
  }
};

exports.getClassroomList = async (req, res) => {
  try {
    const classroomList = await Classroom.find();

    if (classroomList.length === 0) {
      logger.info({ message: 'Aucune salle de classe trouvée' });
      return res.status(404).json({ message: 'Pas de salle de classe trouvée' });
    }

    logger.info({ message: 'Liste de salles de classe bien retournée' });
    res.status(200).json(classroomList);
  } catch (error) {
    logger.error({ message: 'Erreur lors de la récupération de la liste de salles de classe', err: error });
    res.status(500).json({ message: 'Erreur lors de la récupération de la liste de salles de classe.', err: error });
  }
};
