module.exports = app => {
  const requests = require("../controllers/request.controller.js");

  var router = require("express").Router();

  // Create a new Request
  router.post("/", requests.create);

  // Delete a Request with id
  router.delete("/:id", requests.delete);

  // Retrieve all requests
  router.get("/", requests.findAll);

  // Retrieve a request with id
  router.get("/:id", requests.findById);

  // Retrieve request with user email
  router.get("/userYP/:email", requests.findByUser);

  // Update a Request with id
  router.put("/:id", requests.update);

  app.use('/requests', router);

};