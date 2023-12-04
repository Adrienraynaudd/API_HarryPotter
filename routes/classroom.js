const Classroom = require('../models/classroom');
const axios = require('axios');
const logger = require('../logger');
const router = require('express').Router();
exports.createClassroom = async (req, res) => {
    try {
        // Récupération des informations sur les étudiants, les enseignants et les sorts depuis l'API externe
        const [studentsResponse, teachersResponse, spellsResponse] = await Promise.all([
            axios.get('https://hp-api.onrender.com/students'),
            axios.get('https://hp-api.onrender.com/teachers'),
            axios.get('https://hp-api.onrender.com/spells'),
        ]);

        // Supposons que les réponses contiennent des données sous forme de tableaux
        const students = studentsResponse.data;
        const teachers = teachersResponse.data;
        const spells = spellsResponse.data;

        // Sélection aléatoire d'étudiants, d'un enseignant et d'un sort pour la salle de classe
        const randomStudents = getRandomElements(students, 30);
        const randomTeacher = getRandomElement(teachers);
        const randomSpell = getRandomElement(spells);

        // Construction de l'objet représentant la salle de classe
        const classroomData = {
            students: randomStudents,
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

        res.status(200).json({ "message": "Création de la salle de classe bien réalisée", "classroom": savedClassroom });
        logger.info({ message: 'Salle de classe bien créée' });
    } catch (error) {
        logger.error({ message: 'Erreur lors de la création de la salle de classe', "err": error });
        res.status(500).json({ "message": "Erreur lors de la création de la salle de classe.", "err": error });
    }
};

// Fonction pour sélectionner aléatoirement un élément d'un tableau
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Fonction pour sélectionner aléatoirement plusieurs éléments d'un tableau
function getRandomElements(array, count) {
    const shuffledArray = array.sort(() => 0.5 - Math.random());
    return shuffledArray.slice(0, count);
}
module.exports = router;