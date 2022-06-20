const db = require("../models");
const qs = require("qs");
const Submittals = db.submittals;

// Create and save a new submittal
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({ message: "Content cannot be empty!" });
        return;
    }

    // Create a submittal
    const submittal = new Submittals({
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false,
        submittalID: req.body.submittalID,
        needDate: req.body.needDate,        
        priority: req.body.priority ? req.body.priority : false,
    });

    // Save submittal in the database
    submittal
        .save(submittal)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the submittal"
            });
        });
};

// Retrieve all submittals from the database
exports.findAll = (req, res) => {
    console.log('findAll');
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    Submittals.find(condition)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving submittals"
        });
    });
};

// Find a single submittal with an id
exports.findOne = (req, res) => {
const id = req.params.id;

Submittals.findById(id)
    .then(data => {
        if (!data)
            res.status(404).send({ message: "Submittal with id " + id + " not found"});
        else res.send(data);
    })
    .catch(err => {
        res
            .status(500)
            .send({ message: "Error retrieving submittal with id " + id });
    });
};

// Update a submittal by the id in the request
exports.update = (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Data to update cannot be empty!"
        });
    }

    const id = req.params.id;

    Submittals.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Submittal with id ${id}. Maybe submittal was not found.`
                });
            } else res.send({ message: "Submittal was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: `Error updating submittal with id ${id}`
            });
        });
};

// Delete a submittal with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Submittals.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete submittal with id ${id}. Maybe submittal was not found`
                });
            } else {
                res.send({
                    message: "Submittal was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Could not delete submittal with id ${id}`
            });
        });
};

// Delete all submittals from the database.
exports.deleteAll = (req, res) => {
    Submittals.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} submittals were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all submittals."
            });
        });
};

// Find all published submittals
exports.findAllPublished = (req, res) => {
    Submittals.find({ published: true })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving submittals."
            });
        });
};

// Find submittals with a certain owner
exports.findByOwner = (req, res) => {
    const o = req.params.owner;
    console.log('Owner from Controller: ' + o);

    Submittals.find({ owner: o })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Some error occurred while retrieving submittals with specified owner."
        });
    });
};

// Find submittals with a certain violation type
exports.findByViolation = (req, res) => {
    const v = req.params.violation;
    console.log('Violation from Controller: ' + v);

    Submittals.find({ violations: { $elemMatch: { category: v } } })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Some error occurred while retrieving submittals with specified owner."
        });
    });
};
    
// Find open submittals
exports.findOpen = (req, res) => {
    // const v = req.params.violation;
    // console.log('Find open submittals');

    Submittals.find({
        $or: [{
            dispositionDate: { $exists: false }
        }, {
            dispositionDate: null
        }
    ]
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Some error occurred while retrieving open submittals."
        });
    });
};

// Find closed submittals
exports.findClosed = (req, res) => {
    // const v = req.params.violation;
    // console.log('Find open submittals');

    Submittals.find({ dispositionDate: { $ne: null } })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Some error occurred while retrieving open submittals."
        });
    });
};

// Dynamic find
exports.findDynamic = (req, res) => {
    // const v = req.params.violation;
    // console.log('Find open submittals');

    // let { queryList } = req.query;
    //https://stackoverflow.com/questions/57136786/pass-array-as-query-params-using-axios-and-express-router

    console.log('req.query: ' + JSON.stringify(req.query));
    console.log('req.params: ' + JSON.stringify(req.params));

    // console.log('q: ' + req.params.q);

    // const q = [
    //     { key: 'owner', value: 'McBlah', operator: 'or' },
    //     { key: 'submittalID', value: 'Submittal 1', operator: 'or' }
    // ];

    // console.log('q from controller: ' + JSON.stringify(q));

    // var and = [];
    // var or = [];
    // for(var i = 0; i < q.length; i++) {
    //     // console.log(`key: ${q[i].key}, value: ${q[i].value}`);
    //     if(q[i].operator === 'and') {
    //         and.push({[q[i].key]: q[i].value});
    //     }
    //     else {
    //         or.push({[q[i].key]: q[i].value});
    //     }
    // }

    // var q2 = {};
    // if(and.length) {
    //     q2['$and'] = and
    // }

    // if(or.length) {
    //     q2['$or'] = or
    // }

    var q2 = qs.parse(req.query, { allowDots: true });
    console.log('q2: ' + JSON.stringify(q2));
    
    var q3 = { $and: [] };

    if(q2.$and != undefined) {
        q3.$and = q2.$and;
    };
    if(q2.$or != undefined) {
        q3.$and.push({ $or: q2.$or })
    };

    console.log('q3: ' + JSON.stringify(q3));

    // qs.parse expects a string
    const queryString = decodeURIComponent(req.originalUrl.substr(req.originalUrl.indexOf('?')+1));
    var q4 = qs.parse(queryString, {
        decoder: function (str) {
            if (/^(\d+|\d*\.\d+)$/.test(str)) {
                return parseFloat(str);
            }
    
            let keywords = {
                true: true,
                false: false,
                null: null,
                undefined: undefined,
            };
            if (str in keywords) {
                return keywords[str];
            }
    
            return str;
        }
    });

    console.log('q4: ' + JSON.stringify(q4));

    // console.log('q2 should be: ' + '{$and: [{owner: "McBlah"}, {submittalID: "Submittal 1"}]}');
    // https://github.com/ljharb/qs/issues/252
    // q3 ={"$and":[{"submittalID":{"$regex":"Sub"}}]};

    // For date handling: {"$and":[{"needDate" : {"$gte": new Date("2013-10-01T00:00:00.000Z")}}]}

    Submittals.find(q4)
    .then(data => {
        res.send(data);
        console.log('Data: ' + JSON.stringify(data));
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message || "Some error occurred while retrieving open submittals."
        });
    });
};