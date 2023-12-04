const User = require('../models/user');
const logger = require('../logger');

exports.createUser = (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        creationDate: new Date(),
        modificationDate: new Date(),
        creationUser: 'admin',
        modificationUser: 'admin',
        active: true
    });

    user.save().then((savedUser) => {
        res.status(200).json({ "message": "Création de l'utilisateur bien réalisée", "user": savedUser });
        logger.info({ message: 'Utilisateur bien créé' });
    }).catch((err) => {
        logger.error({ message: 'Erreur à la création de l\'utilisateur', "err": err });
        res.status(405).json({ "message": "Erreur lors de la création de l'utilisateur, vérifier le body", "err": err });
    });
}

exports.getUser = (req, res) => {
    const id = req.params.id;

    User.findById(id).then((user) => {
        if (user) {
            logger.info({ message: 'Utilisateur bien renvoyé' });
            res.status(200).json(user);
        } else {
            logger.error({ message: 'Utilisateur introuvable pour cet id' });
            res.status(404).json({ "message": "Pas d'utilisateur trouvé pour cet id" });
        }
    }).catch((err) => {
        logger.error({ message: 'Erreur lors de la récupération de l\'utilisateur', "err": err });
        res.status(404).json({ "message": "Pas d'utilisateur trouvé pour cet id", "err": err });
    });
}

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
