'use strict';

const multivarka = require('./multivarka');

const petr = {
    name: 'Пётр',
    group: 'ПИ-302',
    grade: 5
};

const vasya = {
    name: 'Вася',
    group: 'ПИ-301',
    grade: 4
};

multivarka
    .server('mongodb://localhost/test')
    .collection('students')
    .insert(petr, (err, data) => {
        if (!err) {
            console.log('INSERTED1');
            console.log(data);
        }
    });

multivarka
    .server('mongodb://localhost/test')
    // .collection('students')
    .insert(vasya, (err, data) => {
        if (!err) {
            console.log('INSERTED2');
            console.log(data);
        }
    });

multivarka
    .server('mongodb://localhost/test')
    // .collection('students')
    .where('group').equal('ПИ-301')
    .find((err, data) => {
        if (!err) {
            console.log('FIND1');
            console.log(data);
        }
    });

multivarka
    .server('mongodb://localhost/test')
    // .collection('students')
    .where('group').equal('ПИ-301')
    .set('group', 'ПИ-302')
    .update(function (err, result) {
        if (!err) {
            console.log('UPDATE');
            console.log(result);
        }
    });

multivarka
    .server('mongodb://localhost/test')
    // .collection('students')
    .where('grade').lessThan(5)
    .find((err, data) => {
        if (!err) {
            console.log('FIND3');
            console.log(data);
        }
    });

multivarka
    .server('mongodb://localhost/test')
    // .collection('students')
    .where('grade').greatThan(4)
    .find((err, data) => {
        if (!err) {
            console.log('FIND4');
            console.log(data);
        }
    });

multivarka
    .server('mongodb://localhost/test')
    // .collection('students')
    .where('group').include(['ПИ-301', 'ПИ-302', 'КБ-301'])
    .find((err, data) => {
        if (!err) {
            console.log('FIND5');
            console.log(data);
        }
    });

multivarka
    .server('mongodb://localhost/test')
    // .collection('students')
    .where('group').not().equal('ПИ-301')
    .find((err, data) => {
        if (!err) {
            console.log('FIND6');
            console.log(data);
        }
    });

multivarka
    .server('mongodb://localhost/test')
    // .collection('students')
    .where('group').equal('ПИ-302')
    .remove((err, data) => {
        if (!err) {
            console.log('REMOVE1');
            console.log(data);
        }
    });
