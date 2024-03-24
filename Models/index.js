// module.exports.Classroom = require('./Classroom');
// module.exports.Student = require('./Student');
// module.exports.Tutor = require('./Tutor');
// module.exports.Assignment = require('./Assignment');
// module.exports.Test = require('./Test');
// module.exports.Comment = require('./Comment');

const fs = require('fs');
const path = require('path');
const models = {};
const excludeFiles = ['index.js'];

fs.readdirSync(__dirname)
.filter( file => file.indexOf('.') !== 0 && excludeFiles.indexOf(file) < 0)
.forEach( file => {
    models[file.split('.')[0]] = require(path.join(__dirname, file));
});


module.exports = models;

