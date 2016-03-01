'use strict';

const mongoClient = require('mongodb').MongoClient;

module.exports = {
    server: function (url) {
        this.url = url;
        if (this.condition) {
            if (this.condition[this.condition.length - 1]) {
                this.condition.push({});
            }
        } else {
            this.condition = [{}];
        }
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
        this.condition[this.condition.length - 1] = setLess(n, this);
        this.isNegative = false;
        return this;
    },
    greatThan: function (n) {
        this.condition[this.condition.length - 1] = setGreat(n, this);
        this.isNegative = false;
        return this;
    },
    equal: function (n) {
        this.condition[this.condition.length - 1] = setEqual(n, this);
        this.isNegative = false;
        return this;
    },
    include: function (listObj) {
        this.condition[this.condition.length - 1] = setInclude(listObj, this);
        this.isNegative = false;
        return this;
    },
    find: function (callback) {
        doQuery(this, (collection, db) => {
            collection.find(this.condition.splice(0, 1)[0]).toArray((err, data) => {
                callback(err, data);
                db.close();
            });
        });
    },
    remove: function (callback) {
        doQuery(this, (collection, db) => {
            collection.deleteMany(this.condition.splice(0, 1)[0], (err, data) => {
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
            collection.update(this.condition.splice(0, 1)[0], this.set, (err, data) => {
                callback(err, data);
                db.close();
            });
        });
    },
    insert: function (newObj, callback) {
        doQuery(this, (collection, db) => {
            this.condition.splice(0, 1);
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
            var collection = db.collection(obj.collect);
            callback(collection, db);
        }
    });
}

function getCondition(obj) {
    return obj.condition ? obj.condition[obj.condition.length - 1] : {};
}

function setLess(n, obj) {
    var curCondition = getCondition(obj);
    curCondition[obj.field] = obj.isNegative ? { $gt: n } : { $lt: n };
    return curCondition;
}

function setGreat(n, obj) {
    var curCondition = getCondition(obj);
    curCondition[obj.field] = obj.isNegative ? { $lt: n } : { $gt: n };
    return curCondition;
}

function setEqual(n, obj) {
    var curCondition = getCondition(obj);
    curCondition[obj.field] = obj.isNegative ? { $ne: n } : n;
    return curCondition;
}

function setInclude(listObj, obj) {
    var curCondition = getCondition(obj);
    curCondition[obj.field] = obj.isNegative ? { $nin: listObj } : { $in: listObj };
    return curCondition;
}
