const Request = require("../models/request.model.js");
const UserYP =  require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');
const {generatePassword} = require ("../config/password");
const {sendAnswerNotification} = require("../config/nodemailer");

const CLIENT_ADDRESS = "http://86.119.46.224";

// Create and Save a new Request
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const updatedTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  // Create a Request
  const request = new Request({
    id: req.body.id,
    question: req.body.question,
    email: req.body.email,
    user_career: req.body.user_career,
    created: updatedTimestamp,
    updated: updatedTimestamp
  });

  // Save Request in the database
  Request.create(request, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Request."
      });
    else {
      UserYP.findByEmail(req.body.email, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            const password = generatePassword(14);

            console.log("Mail not found, Creating user.")

            const user_yp = {
              id: uuidv4(),
              email: req.body.email,
              career: req.body.user_career,
              password: bcrypt.hashSync(password, 8) //Hash the password before saving
            };

            UserYP.create(
                user_yp,
                (err, data) => {
                  if (err)
                    res.status(500).send({
                      message:
                          err.message || "Some error occurred while creating the UserYP."
                    });
                  else {
                    const newMessage = {
                      email: req.body.email,
                      subject: "Neues Konto ist für Dich erstellt worden!",
                      message:`<h2>Liebe/r Nutzende,</h2>
                    <p>Dein Passwort für Easystep Connect lautet: <strong> ${password} </strong></p>
                    <p>Du kannst damit <a href="${CLIENT_ADDRESS}/Login">hier</a> in deinen Account einloggen.</p>
                    <p>Easystep Connect.</p>`
                    }
                    sendAnswerNotification(newMessage.email, newMessage.subject, newMessage.message);
                  }
                }
            )
          } else {
            res.status(500).send({
              message: "Error checking db for existing email"
            });
          }
        } else {
          console.log("Mail found:",data);
        }
      })
      const requestId = data.id;
      const newMessage = {
        message: `
            \<h1>Neue Nachricht für Dich!</h1>
                <h2>Liebe/r Nutzende,</h2>
                <p>Danke für Deine Anfrage.</p>
                <p>Wenn Du neu bei Easystep Connect bist haben wir ein Konto für dich erstellt.</p> 
                <p>Bitte schaue auch in deinem Spam Ordner, wir haben Dir eine Email mit deinem Passwort geschickt.</p>
                <a href="${CLIENT_ADDRESS}/ChatYPExpert/${requestId}">Klicke hier</a> um deine Unterhaltung mit den Experten zu sehen.
              `,
        subject: `Neues Anliegen!`,
        email: request.email
      };
      sendAnswerNotification (newMessage.email,newMessage.subject,newMessage.message);
      res.send(data);
    }
  });
};


// Retrieve all Requests from the database (with condition).
exports.findAll = (req, res) => {
  Request.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving requests."
      });
    else res.send(data);
  });
};

exports.findByUser = (req, res) => {
  Request.findByUser(req.params.email, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving requests."
      });
    else res.send(data);
  });
};

// Find a single Request by Id
exports.findById = (req, res) => {
  Request.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: "Not found request with id " + req.params.id
        });
      } else {
        res.status(500).send({
          essage: "Error retrieving request with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

// Update a Request identified by the id in the request
exports.update = (req, res) => {
  // Validate Request (request  from the server, not a question)
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Request.updateById( req.params.id, updatedTimestamp, pendingLock, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: "Not found Request with id " + req.params.id
          });
        } else {
          res.status(500).send({
            message: "Error updating Request with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Request with the specified id in the request (from the server, not a question)
exports.delete = (req, res) => {
  Request.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Request with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Request with id " + req.params.id
        });
      }
    } else res.send({ message: `Request was deleted successfully!` });
  });
};