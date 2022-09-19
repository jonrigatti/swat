module.exports = app => {
    const server = require("../controllers/server.controller.js");

    var router =  require("express").Router();

    // Order of these matters for some dumb reason...

    router.get("/testdir", server.testDir);
    router.put("/createSDF/:id", server.createSDF);
    router.put("/createPDF/:id", server.createPDF);

    app.use('/api/server', router);
}