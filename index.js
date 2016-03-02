'use strict';

const multivarka = require('./multivarka');

multivarka
    .server('mongodb://localhost/test')
    .collection('students');

multivarka
    .find((err, data) => {
        console.log('FIND ALL STUDENTS');
        console.log(data);
    });

multivarka
    .where('name').equal('Пётр')
    .find((err, data) => {
        console.log('FIND1');
        console.log(data);
    });

multivarka
    .server('mongodb://localhost/test')
    .collection('students')
    .remove((err, data) => {
        console.log('hi');
    });

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
    .insert(petr, (err, data) => {
        if (!err) {
            console.log('INSERTED1');
            console.log(data);
        }
    });

multivarka
    .insert(vasya, (err, data) => {
        if (!err) {
            console.log('INSERTED2');
            console.log(data);
        }
    });

multivarka
    .where('group').equal('ПИ-301')
    .find((err, data) => {
        if (!err) {
            console.log('FIND2');
            console.log(data);
        }
    });

multivarka
    .where('group').equal('ПИ-301')
    .set('group', 'ФТ-302')
    .update(function (err, result) {
        if (!err) {
            console.log('UPDATE');
            console.log(result);
        }
    });

multivarka
    .where('grade').not().lessThan(4)
    .find((err, data) => {
        if (!err) {
            console.log('FIND3');
            console.log(data);
        }
    });

multivarka
    .where('group').include(['ПИ-301', 'ПИ-302', 'ФТ-302'])
    .find((err, data) => {
        if (!err) {
            console.log('FIND4');
            console.log(data);
        }
    });

multivarka
    .where('group').not().equal('ПИ-301')
    .where('group').equal('ПИ-302')
    .find((err, data) => {
        if (!err) {
            console.log('FIND5');
            console.log(data);
        }
    });
