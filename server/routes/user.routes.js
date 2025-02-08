module.exports = app => {

    const user = require("../controllers/user.controller.js");
    var router = require("express").Router();

    // Create a new UserYP
    router.post("/", user.create);

    // Login an YP User
    router.post("/login", user.login);

    // Retrieve a single UserYP with id
    router.get("/:id", user.findById);

    router.put("/:id", user.editProfile);

    router.get("/user", user.userData);

    router.put("/experts/:id", user.editExpert);

    router.get("/", user.findAll);

    router.delete("/:id", user.deleteById);

    // Reset Password by email
    router.post("/reset", user.resetPassword);

    app.use('/users', router);
};
