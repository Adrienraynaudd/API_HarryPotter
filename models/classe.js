const mongoose = require('mongoose');

const classroomSchema = mongoose.Schema({
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    spell: { type: mongoose.Schema.Types.ObjectId, ref: 'Spell', required: true },
    creationDate: { type: Date, required: true },
    modificationDate: { type: Date, required: true },
    creationUser: { type: String, required: true },
    modificationUser: { type: String, required: true },
    active: { type: Boolean, required: true },
});

module.exports = mongoose.model('Classroom', classroomSchema);
