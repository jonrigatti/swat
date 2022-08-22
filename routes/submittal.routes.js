module.exports = app => {
    const submittals = require("../controllers/submittal.controller.js");

    var router =  require("express").Router();

    // Order of these matters for some dumb reason...

    // Create a new submittal
    router.post("/", submittals.create);

    // Find open submittals
    router.get("/open", submittals.findOpen);

    // Find closed submittals
    router.get("/closed", submittals.findClosed);

    // Find submittals with a dynamic query
    router.get("/query/", submittals.findDynamic);

    // Retrieve all submittals
    router.get("/", submittals.findAll);

    // Retrieve a single submittal with id
    router.get("/:id", submittals.findOne);
    
    // Find by violation
    router.get("/violations/:violation", submittals.findByViolation);

    // Find by owner
    router.get("/owners/:owner", submittals.findByOwner);

    // Update a submittal with id
    router.put("/:id", submittals.update);

    // Delete a submittal with id
    router.delete("/:id", submittals.delete);

    // Create a new submittal
    // router.delete("/", submittals.deleteAll);

    app.use('/api/submittals', router);
}