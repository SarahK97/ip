const Answer = require("../models/answer.model.js");
const { sendAnswerNotification } = require("../config/nodemailer");
const Request =  require("../models/request.model.js");

const CLIENT_ADDRESS = "http://86.119.46.224";

// Create and Save a new Request
exports.create = (req, res) => {
  // Validate answer
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const updatedTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  // Create Answer
  const answer = new Answer({
    id: req.body.id,
    id_request: req.body.id_request,
    text: req.body.text,
    type_user: req.body.type_user,
    id_user: req.body.id_user,
    date: updatedTimestamp
  });

  // Save Answer in the database
  Answer.create(answer, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Request."
      });

    else {
      Request.findById(req.body.id_request, (err, request) => {
        if (err) {
          console.log(err);
          return res.status(500).send({
            message: "Error retrieving request with id " + req.body.id_request
          });
        }

        if (!request) {
          console.log("Request not found");
          return res.status(404).send({
            message: "Request not found"
          });
        }

        // If the request is found, retrieve the email from the request and send the notification
        if (request && answer.type_user == 'expert') {
          const newMessage = {
            message: `<h1>Neue Nachricht für Dich!</h1>
                <h2>Liebe/r Nutzende,</h2>
                <p>Du hast auf Easystep Connect eine Antwort zu deinem Anliegen erhalten.</p>
                <a href="${CLIENT_ADDRESS}/ChatYPExpert/${request[0].id}">Klicke hier</a> um zur Unterhaltung zu gelangen.             `,
            subject: "Neue Antwort!",
            email: request[0].email
          }
          console.log(newMessage);
          sendAnswerNotification(newMessage.email, newMessage.subject, newMessage.message);

          Request.updateById(req.body.id_request, request[0].updated, '1', (err, request) => {
            if (err) {
              res.status(500).send({
                  message: err.message || "Error updating the request updated",
              });
              return;
            }
          })

          res.send(data);
        }
        else {
          Request.updateById(req.body.id_request, answer.date, '0', (err, request) => {
            if (err) {
              res.status(500).send({
                  message: err.message || "Error updating the request updated",
              });
              return;
            }
          })
          res.send(data);
        } 
      });
    }
  });
};

// Find a single Answer by Id
exports.findOne = (req, res) => {
  Answer.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: "Not found Answer with id " + req.params.id
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Answer with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};
