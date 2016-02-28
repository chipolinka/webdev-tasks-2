'use strict';

const mongoClient = require('mongodb').MongoClient;

module.exports = {
    server: function (url) {
        this.url = url;
        return this;
    },
    collection: function (collection) {
        this.collection = collection;
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
        this.condition = setLess(n, this);
        return this;
    },
    greatThan: function (n) {
        this.condition = setGreat(n, this);
        return this;
    },
    equal: function (n) {
        this.condition = setEqual(n, this);
        return this;
    },
    include: function (listObj) {
        this.condition = setInclude(listObj, this);
        return this;
    },
    find: function (callback) {
        doQuery(this, (collection, db) => {
            collection.find(this.condition).toArray((err, data) => {
                callback(err, data);
                db.close();
            });
        });
    },
    remove: function (callback) {
        doQuery(this, (collection, db) => {
            collection.remove(this.condition, (err, data) => {
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
        doQuery(this, (collection, db) => {
            collection.update(this.condition, this.set, (err, data) => {
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
            var collection = db.collection(obj.collection);
            callback(collection, db);
        }
    });
}

function setLess(n, obj) {
    var newObj = {};
    newObj[obj.field] = obj.isNegative ? { $gt: n } : { $lt: n };
    return newObj;
}

function setGreat(n, obj) {
    var newObj = {};
    newObj[obj.field] = obj.isNegative ? { $lt: n } : { $gt: n };
    return newObj;
}

function setEqual(n, obj) {
    var newObj = {};
    newObj[obj.field] = obj.isNegative ? { $ne: n } : n;
    return newObj;
}

function setInclude(listObj, obj) {
    var newObj = {};
    newObj[obj.field] = obj.isNegative ? { $nin: listObj } : { $in: listObj };
    return newObj;
}
