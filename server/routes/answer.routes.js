module.exports = app => {
    const answer = require("../controllers/answer.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Answer
    router.post("/", answer.create);

    // Retrieve a single Answer with id
    router.get("/:id", answer.findOne);
  
    app.use('/answers', router);
  };

