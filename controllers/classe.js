const Classroom = require('../models/classroom');
const logger = require('../logger');


exports.createClassroom = (req, res) => {
    let classroom = new Classroom({
        students: req.body.students,
        teacher: req.body.teacher,
        spell: req.body.spell,
        creationDate: new Date(),
        modificationDate: new Date(),
        creationUser: 'admin',
        modificationUser: 'admin',
        active: true
    });

    classroom.save().then((savedClassroom) => {
        res.status(200).json({ "message": "Création de la salle de classe bien réalisée", "classroom": savedClassroom });
        logger.info({ message: 'Salle de classe bien créée' });
    }).catch((err) => {
        logger.error({ message: 'Erreur à la création de la salle de classe', "err": err });
        res.status(405).json({ "message": "Erreur lors de la création de la salle de classe, vérifier le body", "err": err });
    });
}

exports.getClassroom = (req, res) => {
    const id = req.params.id;

    Classroom.findById(id).then((classroom) => {
        if (classroom) {
            logger.info({ message: 'Salle de classe bien renvoyée' });
            res.status(200).json(classroom);
        } else {
            logger.error({ message: 'Salle de classe introuvable pour cet id' });
            res.status(404).json({ "message": "Pas de salle de classe trouvée pour cet id" });
        }
    }).catch((err) => {
        logger.error({ message: 'Erreur lors de la récupération de la salle de classe', "err": err });
        res.status(404).json({ "message": "Pas de salle de classe trouvée pour cet id", "err": err });
    });
}

exports.updateClassroom = (req, res) => {
    const id = req.params.id;

    req.body.modificationDate = new Date();
    Classroom.updateOne({ _id: id }, req.body).then((updatedClassroom) => {
        if (updatedClassroom.nModified > 0) {
            logger.info({ message: 'Salle de classe bien mise à jour' });
            res.status(200).json({ "message": "Modification de la salle de classe bien réalisée", "classroom": updatedClassroom });
        } else {
            logger.error({ message: 'Salle de classe introuvable pour la mise à jour' });
            res.status(405).json({ "message": "Erreur lors de la mise à jour de la salle de classe, vérifier le body" });
        }
    }).catch((err) => {
        logger.error({ message: 'Erreur lors de la mise à jour de la salle de classe', "err": err });
        res.status(405).json({ "message": "Erreur lors de la mise à jour de la salle de classe, vérifier l'id'" });
    });
}

exports.deleteClassroom = (req, res) => {
    const id = req.params.id;

    Classroom.findByIdAndDelete(id).then((result) => {
        if (result) {
            logger.info({ message: 'Salle de classe bien supprimée' });
            res.status(200).json({ "message": "Suppression de la salle de classe bien réalisée" });
        } else {
            logger.error({ message: 'Salle de classe introuvable pour la suppression' });
            res.status(404).json({ "message": "Cette salle de classe n'existe pas" });
        }
    }).catch((err) => {
        logger.error({ message: 'Erreur lors de la suppression de la salle de classe', "err": err });
        res.status(404).json({ "message": "Erreur lors de la suppression de la salle de classe", "err": err });
    });
}

exports.getClassroomList = (req, res) => {
    Classroom.find().then((classroomList) => {
        logger.info({ message: 'Liste de salles de classe bien retournée' });
        res.status(200).json(classroomList);
    }).catch((err) => {
        logger.error({ message: 'Pas de résultat pour la liste de salles de classe', "err": err });
        res.status(404).json({ "message": "Pas de salle de classe", "err": err });
    });
}
