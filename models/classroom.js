// Assurez-vous que votre modèle Classroom ressemble à quelque chose comme ceci
const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
    students: [String],
  teacher: String,     
  spell: String,    
  creationDate: Date,
  modificationDate: Date,
  creationUser: String,
  modificationUser: String,
  active: Boolean,
});

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;