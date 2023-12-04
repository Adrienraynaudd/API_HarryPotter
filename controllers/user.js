const User = require('../models/user');
const logger = require('../logger');

exports.updateUser = (req, res) => {
    const id = req.params.id;

    req.body.modificationDate = new Date();
    User.updateOne({ _id: id }, req.body).then((updatedUser) => {
        if (updatedUser.nModified > 0) {
            logger.info({ message: 'Utilisateur bien mis à jour' });
            res.status(200).json({ "message": "Modification de l'utilisateur bien réalisée", "user": updatedUser });
        } else {
            logger.error({ message: 'Utilisateur introuvable pour la mise à jour' });
            res.status(405).json({ "message": "Erreur lors de la mise à jour de l'utilisateur, vérifier le body" });
        }
    }).catch((err) => {
        logger.error({ message: 'Erreur lors de la mise à jour de l\'utilisateur', "err": err });
        res.status(405).json({ "message": "Erreur lors de la mise à jour de l'utilisateur, vérifier l'id'" });
    });
}

exports.deleteUser = (req, res) => {
    const id = req.params.id;

    User.findByIdAndDelete(id).then((result) => {
        if (result) {
            logger.info({ message: 'Utilisateur bien supprimé' });
            res.status(200).json({ "message": "Suppression de l'utilisateur bien réalisée" });
        } else {
            logger.error({ message: 'Utilisateur introuvable pour la suppression' });
            res.status(404).json({ "message": "Cet utilisateur n'existe pas" });
        }
    }).catch((err) => {
        logger.error({ message: 'Erreur lors de la suppression de l\'utilisateur', "err": err });
        res.status(404).json({ "message": "Erreur lors de la suppression de l'utilisateur", "err": err });
    });
}

exports.getUserList = (req, res) => {
    User.find().then((userList) => {
        logger.info({ message: 'Liste d\'utilisateurs bien retournée' });
        res.status(200).json(userList);
    }).catch((err) => {
        logger.error({ message: 'Pas de résultat pour la liste d\'utilisateurs', "err": err });
        res.status(404).json({ "message": "Pas d'utilisateur", "err": err });
    });
}
