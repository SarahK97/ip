const sql = require("../config/db.js");

const Answer = function(answer){
    this.id = answer.id;
    this.id_request = answer.id_request
    this.text = answer.text;
    this.type_user = answer.type_user;
    this.id_user = answer.id_user;
    this.date = answer.date;
}


Answer.create = (newAnswer, result) =>{
    sql.query(
        'INSERT INTO answers SET ?',
        newAnswer, (err, res) => {
            if (err) {
                console.log(err);
                result(err, null);
            }

        console.log("created answer: ", { ...newAnswer });
        result(null, { ...newAnswer });
    });
 };

 // Find by Answer by RequestId
 Answer.findById = (id, result) => {
    sql.query(`SELECT * FROM answers WHERE id_request = '${id}' ORDER BY date`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      result(null, res);
    });
  };

 module.exports = Answer;
