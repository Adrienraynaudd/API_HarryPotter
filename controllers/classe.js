const Classroom = require('../models/classroom');
const axios = require('axios');
const logger = require('../logger');

// Fonction pour sélectionner aléatoirement plusieurs éléments d'un tableau
function getRandomElements(array, count) {
    if (array.length === 0) {
        return [];
    }

    const randomIndices = Array.from({ length: count }, () => Math.floor(Math.random() * array.length));
    return randomIndices.map(index => array[index].name);
}

// Fonction pour sélectionner aléatoirement un élément d'un tableau
function getRandomElement(array) {
    if (array.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex].name;
}

const logInfo = (message, req) => {
    logger.info({
        level: 'info',
        message: message,
        timestamp: new Date().toISOString(),
        user: req.user ? req.user.email : 'Non authentifié',
        route: req.originalUrl
    });
};

const logError = (message, error, req) => {
    logger.error({
        level: 'error',
        message: message,
        err: error,
        timestamp: new Date().toISOString(),
        user: req.user ? req.user.email : 'Non authentifié',
        route: req.originalUrl
    });
};

exports.createClassroom = async (req, res) => {
    try {
        const [studentsResponse, teachersResponse, spellsResponse] = await Promise.all([
            axios.get('https://hp-api.onrender.com/api/characters/students'),
            axios.get('https://hp-api.onrender.com/api/characters/staff'),
            axios.get('https://hp-api.onrender.com/api/spells'),
        ]);

        const students = studentsResponse.data;
        const teachers = teachersResponse.data;
        const spells = spellsResponse.data;

        const randomStudentNames = getRandomElements(students, 30);
        const randomTeacher = getRandomElement(teachers);
        const randomSpell = getRandomElement(spells);

        if (!randomTeacher || !randomSpell) {
            return res.status(500).json({ message: 'Erreur lors de la création de la salle de classe. Enseignant ou sort manquant.' });
        }

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

        const classroom = new Classroom(classroomData);
        const savedClassroom = await classroom.save();

        res.status(200).json({ message: 'Création de la salle de classe bien réalisée', classroom: savedClassroom });
        logInfo('Salle de classe bien créée', req);
    } catch (error) {
        logError('Erreur lors de la création de la salle de classe', error, req);
        res.status(500).json({ message: 'Erreur lors de la création de la salle de classe.', err: error });
    }
};

exports.getClassroom = async (req, res) => {
    try {
        const id = req.params.id;
        const classroom = await Classroom.findById(id);

        if (!classroom) {
            logError('Salle de classe introuvable pour cet id', null, req);
            return res.status(404).json({ message: 'Pas de salle de classe trouvée pour cet id' });
        }

        logInfo('Salle de classe bien renvoyée', req);
        res.status(200).json(classroom);
    } catch (error) {
        logError('Erreur lors de la récupération de la salle de classe', error, req);
        res.status(500).json({ message: 'Erreur lors de la récupération de la salle de classe.', err: error });
    }
};

exports.updateClassroom = async (req, res) => {
    try {
        const id = req.params.id;
        req.body.modificationDate = new Date();

        const updatedClassroom = await Classroom.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedClassroom) {
            logError('Salle de classe introuvable pour la mise à jour', null, req);
            return res.status(404).json({ message: 'Erreur lors de la mise à jour de la salle de classe, vérifier le body' });
        }

        logInfo('Salle de classe bien mise à jour', req);
        res.status(200).json({ message: 'Modification de la salle de classe réussie', classroom: updatedClassroom });
    } catch (error) {
        logError('Erreur lors de la mise à jour de la salle de classe', error, req);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la salle de classe.', err: error });
    }
};

exports.deleteClassroom = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Classroom.findByIdAndDelete(id);

        if (!result) {
            logError('Salle de classe introuvable pour la suppression', null, req);
            return res.status(404).json({ message: 'Cette salle de classe n\'existe pas' });
        }

        logInfo('Salle de classe bien supprimée', req);
        res.status(200).json({ message: 'Suppression de la salle de classe réussie' });
    } catch (error) {
        logError('Erreur lors de la suppression de la salle de classe', error, req);
        res.status(500).json({ message: 'Erreur lors de la suppression de la salle de classe.', err: error });
    }
};

exports.getClassroomList = async (req, res) => {
    try {
        const classroomList = await Classroom.find();

        if (classroomList.length === 0) {
            logInfo('Aucune salle de classe trouvée', req);
            return res.status(404).json({ message: 'Pas de salle de classe trouvée' });
        }

        logInfo('Liste de salles de classe bien retournée', req);
        res.status(200).json(classroomList);
    } catch (error) {
        logError('Erreur lors de la récupération de la liste de salles de classe', error, req);
        res.status(500).json({ message: 'Erreur lors de la récupération de la liste de salles de classe.', err: error });
    }
};