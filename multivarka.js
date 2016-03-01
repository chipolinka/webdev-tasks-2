'use strict';

const mongoClient = require('mongodb').MongoClient;

module.exports = {
    server: function (url) {
        this.url = url;
        this.condition = this.condition ? this.condition : [];
        this.condition.push({});
        return this;
    },
    collection: function (collection) {
        this.collect = collection;
        return this;
    },
    not: function () {
        this.isNegative = true;
        return this;
    },
    where: function (field) {
        this.field = field;
        return this;
    },
    lessThan: function (n) {
        this.condition = setCondition(this, 'less', n);
        this.isNegative = false;
        return this;
    },
    greatThan: function (n) {
        this.condition = setCondition(this, 'great', n);
        this.isNegative = false;
        return this;
    },
    equal: function (n) {
        this.condition = setCondition(this, 'equal', n);
        this.isNegative = false;
        return this;
    },
    include: function (listObj) {
        this.condition = setCondition(this, 'include', listObj);
        this.isNegative = false;
        return this;
    },
    find: function (callback) {
        doQuery(this, (collection, db, condition) => {
            collection.find(condition).toArray((err, data) => {
                callback(err, data);
                db.close();
            });
        });
    },
    remove: function (callback) {
        doQuery(this, (collection, db, condition) => {
            collection.deleteMany(condition, (err, data) => {
                callback(err, data);
                db.close();
            });
        });
    },
    set: function (key, value) {
        var setField = {};
        setField[key] = value;
        this.set = { $set: setField };
        return this;
    },
    update: function (callback) {
        doQuery(this, (collection, db, condition) => {
            collection.update(condition, this.set, (err, data) => {
                callback(err, data);
                db.close();
            });
        });
    },
    insert: function (newObj, callback) {
        doQuery(this, (collection, db) => {
            collection.insert(newObj, (err, data) => {
                callback(err, data);
                db.close();
            });
        });
    }
};

function doQuery(obj, callback) {
    mongoClient.connect(obj.url, (err, db) => {
        if (err) {
            console.error(err);
        } else {
            callback(db.collection(obj.collect), db, obj.condition.splice(0, 1)[0]);
        }
    });
}

function setCondition(obj, name, n) {
    obj.condition[obj.condition.length - 1][obj.field] = getMongoCommand(name, n, obj.isNegative);
    return obj.condition;
}

function getMongoCommand(condition, n, isNegative) {
    switch (condition) {
        case 'less':
            return isNegative ? { $gt: n } : { $lt: n };
        case 'great':
            return isNegative ? { $lt: n } : { $gt: n };
        case 'equal':
            return isNegative ? { $ne: n } : n;
        case 'include':
            return isNegative ? { $nin: n } : { $in: n };
    }
}
