const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const {generatePassword} = require("../config/password");
const {sendAnswerNotification} = require("../config/nodemailer");

const CLIENT_ADDRESS = "http://86.119.46.224";

// Create and save a new user to the database
exports.create = (req, res) => {
    // Validate userYP
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    let password = req.body.password;

        if (req.body.role === 'expert' || req.body.role === 'admin'){
        password = generatePassword(10);
    }
    // Create a user
    const user = {
        id: req.body.id,
        firstname: req.body.firstname,
        name: req.body.name,
        email: req.body.email,
        career: req.body.career,
        role:req.body.role,
        password: bcrypt.hashSync(password, 8), //Hash the password before saving
        socialMediaProfile:req.body.socialMediaProfile || null,
        pdfFiles: req.body.pdfFiles || null,
        aboutMe:req.body.aboutMe || null
    };

    // Save Young Professional in the database
    User.create(user, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        else {
            // Generate and return JWT token to the user upon successful signup for email verification
            const token = generateToken(user._id);
            res.send({auth: true, token: token, role: 'userYP', user: data});
            if (req.body.role === 'expert' || req.body.role === 'admin') {
                const newMessage = {
                    email: req.body.email,
                    subject: "We created an account for you!",
                    message:`<p>Dear User,</p>
                    <p>Here is your initial password: <strong> ${password} </strong></p>
                    <p>You can use this email and the given password to log in to your account <a href="${CLIENT_ADDRESS}/Login">here</a>.</p>
                    <p>If you wish to change your password at any time, please click <a href="${CLIENT_ADDRESS}/EditProfile">here</a>.</p>
                    <p>Thank you,</p>
                    <p>Easystep Connect.</p>`
                }
                sendAnswerNotification(newMessage.email, newMessage.subject, newMessage.message);
            }
        }
    });
};

// Generate a JWT token - TO DO adjust Token is only issued when email is verified
//Add expiresIn property
function generateToken(userId) {
    return jwt.sign({id: userId}, process.env.JWT_SECRET);
}


// Login of a user
exports.login = (req, res) => {

    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    console.log("login user request received:", req.body);

    // Login a User
    const user = new User({
        email: req.body.email,
        password: req.body.password,
    });

    // Login YP User from the database
    User.login(user, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving an YP user."
            });
        else {
            console.log("login successful:", data);
            const token = generateToken(data.user.id);
            res.send({auth: true, token: token, role: data.user.role, user: data.user});
        }
    });
};

//Retrieve YP User from database --> used for editing
exports.findById = (req, res) => {
    User.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `User with id ${req.params.id} not found.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving user with id " + req.params.id
                });
            }
        } else {
            res.send(data);
        }
    });
};

// Update the expert info
exports.editExpert = (req, res) => {
    // Get the user ID from the request parameters
    const userId = req.params.id;

    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }

    // Update user with the new information
    const updatedUser = {
        firstname: req.body.firstname,
        name: req.body.name,
        email: req.body.email
    };

    User.updateExpertById(userId, updatedUser, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Error updating the user profile",
            });
            return;
        }

        res.send(data);
    });
};


// Update the user profile
exports.editProfile = (req, res) => {
    // Get the user ID from the request parameters
    const userId = req.params.id;

    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    User.findById(userId, async (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `User with id ${req.params.id} not found.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving user with id " + req.params.id
                });
            }
        } else {
            // If a field is not provided in the update request, keep the original value
            const updatedUser = {
                firstname: req.body.firstname || data.firstname,
                name: req.body.name || data.name,
                email: req.body.email || data.email,
                career: req.body.career || data.career,
                socialMediaProfile: req.body.socialMediaProfile || data.socialMediaProfile,
                aboutMe: req.body.aboutMe || data.aboutMe,
            };
            if (data.password === req.body.password) {
                updatedUser.password = data.password;
            } else {
                updatedUser.password = bcrypt.hashSync(req.body.password, 8);
            }

            User.updateById(userId, updatedUser, (err, data) => {
                if (err) {
                    res.status(500).send({
                        message: err.message || "Error updating the user profile",
                    });
                    return;
                }
                res.send(data);
            });
        }
    })
};

exports.updatePdfFilesUrlById = (userId, publicUrls, next) => {
    User.updatePdfFilesUrlById(userId, publicUrls, (err, data) => {
        if (err) {
            console.log("error: ", err);
            next(err);
            return;
        }
        console.log("updated user pdfFilesUrl: ", data);
    });
};

exports.deletePdfFilesUrlById = (userId, pdfUrl, result) => {
    User.deletePdfFilesUrlById(userId, pdfUrl, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                result({ kind: "not_found" }, null);
            } else {
                result(err, null);
            }
        } else {
            result(null, data);
        }
    });
};

exports.updateProfileImageUrlById = (userId, publicUrl, next) => {
    User.updateProfileImageUrlById(userId, publicUrl, (err, data) => {
            if (err) {
                console.log("error: ", err);
                next(err);
                return;
            }
            console.log("updated user profileImageUrl: ", data);
        });
};

// Retrieve a single User with email
exports.findByEmail = (req, res) => {

    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    console.log(" YP request received:", req.body);
    // Login a YP User
    const userYP = new User({
        email: req.body.email,
        password: null,
    });

    // Login YP User from the database
    User.findByEmail(req.params.email, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: err.message || `User with email ${req.params.email} not found.`
                });
            } else {
                res.status(500).send({
                    message: err.message || "Error retrieving user with email " + req.params.email
                });
            }
        } else {
            console.log("found user: ", data);
            res.send(data.user);
        }
    });
};

exports.resetPassword = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    User.findByEmail(req.body.email, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: err.message || `User with email ${req.body.email} not found.`
                });
            } else {
                res.status(500).send({
                    message: err.message || "Error retrieving user with email " + req.body.email
                });
            }
        } else {
            console.log("found user: ", data);
            const newPassword = generatePassword(10);
            const hashedPassword = bcrypt.hashSync(newPassword, 8);

            User.updatePasswordById(data.id, hashedPassword, (err, data) => {
                if (err) {
                    res.status(500).send({
                        message: err.message || "Error updating the user profile",
                    });
                    return;
                }
            });

            const newMessage = {
                email: req.body.email,
                subject: "Your New Password!",
                message: `<p>Dear User,</p>
                <p>Here is your initial password: <strong> ${newPassword} </strong></p>
                <p>You can use this email and the given password to log in to your account <a href="${CLIENT_ADDRESS}/Login">here</a>.</p>
                <p>Thank you,</p>
                <p>Easystep Connect.</p>`

            }
            sendAnswerNotification(newMessage.email, newMessage.subject, newMessage.message);
            res.send(data.user);
        }
    });
    
}

//Retrieve all users from the database


exports.findAll = (req, res) => {
    if (Object.keys(req.query).length === 0) {
        console.log("Get all users");
        User.findAll((err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving UserYPs."
                });
            else res.send(data);
        });
    } else {
        console.log("Get all users with role:", req.query);
        const role = req.query.role;
        User.findAllByRole(role, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: err.message || `Users with ${req.query} not found.`
                    });
                } else {
                    res.status(500).send({
                        message: err.message || "Error retrieving users with " + req.query
                    });
                }
            } else {
                console.log("found users: ", data);
                res.send(data);
            }
        });
    }
};

exports.deleteById = (req, res) => {
    User.deleteById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `User with id ${req.params.id} not found.`
                });
            } else {
                res.status(500).send({
                    message: "Error deleting user with id " + req.params.id
                });
            }
        } else {
            res.send(data);
        }
    });
};


exports.userData = (req, res) => {
    res.send(req.user);
};
