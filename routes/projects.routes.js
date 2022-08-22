module.exports = app => {
    const projects = require("../controllers/project.controller.js");

    var router =  require("express").Router();

    // Order of these matters for some dumb reason...

    // Create a new project
    router.post("/", projects.create);

    // Retrieve all projects
    router.get("/", projects.findAll);

    // Retrieve a single project with id
    router.get("/:id", projects.findOne);

    // Update a project with id
    router.put("/:id", projects.update);

    // Delete a project with id
    router.delete("/:id", projects.delete);

    // Create a new project
    // router.delete("/", projects.deleteAll);

    app.use('/api/projects', router);
}