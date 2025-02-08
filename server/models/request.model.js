const sql = require("../config/db.js");

const Request = function(request){
  this.id = request.id;
  this.question = request.question;
  this.email = request.email;
  this.user_career = request.user_career;
  this.created = request.created;
  this.updated = request.updated;
}

// Creating a new request
Request.create = (newRequest, result) =>{
sql.query(
    'INSERT INTO requests SET ?',
    newRequest, (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
        }

    console.log("created request: ", { ...newRequest });
    result(null, { ...newRequest });
    });
 };

// Get all the requests from the db
Request.getAll = (result) => {
  sql.query("SELECT * FROM requests WHERE pending = 0 ORDER BY updated ASC", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Request.findByUser = (email, result) => {
  sql.query(`SELECT * FROM requests WHERE email = '${email}' ORDER BY updated ASC`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    
    result(null, res);
  });
};

 // Find by RequestId
 Request.findById = (id, result) => {
  sql.query(`SELECT * FROM requests WHERE id = '${id}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, res);
  });
};


Request.updateById = (id, updatedTimestamp, peendingLock, result) => {
  sql.query(
    "UPDATE requests SET updated = ?, pending = ? WHERE id = ?",
    [updatedTimestamp, peendingLock, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Request with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated request: ", { id: id, update: updatedTimestamp, pending: peendingLock });
      result(null, { id: id, updated: updatedTimestamp, pending: peendingLock });
    }
  );
};

Request.delete = (id, result) => {
  sql.query("DELETE FROM requests WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Request with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted request with id: ", id);
    result(null, res);
  });
};

module.exports = Request;