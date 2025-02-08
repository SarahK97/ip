const sql = require("../config/db.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'secreteKey';

const User = function (user) {
    this.id = user.id;
    this.name = user.name;
    this.firstname = user.firstname;
    this.email = user.email;
    this.career = user.career;
    this.password = user.password;
    this.role = user.role;
    this.socialMediaProfile = user.socialMediaProfile;
    this.aboutMe = user.aboutMe;
    this.pdfFiles = user.pdfFiles;
    this.pdfFilesUrl = user.pdfFilesUrl;
    this.profileImageUrl = user.profileImageUrl;
}

User.create = (newUser, result) => {
    sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created User:", {...newUser});
        result(null, {...newUser});
    });
};


User.login = (user, result) => {

    const query = `SELECT *
                   FROM users
                   WHERE email = '${user.email}'`;

    sql.query(query, async (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
        }

        const userFromDb = res && res[0];

        if (!userFromDb) {
            console.log("User not found");
            result(new Error("User not found"), null);
            return;
        }

        console.log("found user: ", userFromDb);
        const isMatch = await bcrypt.compare(user.password, userFromDb.password);
        if (isMatch) {
            const token = jwt.sign({id: userFromDb.id}, secret);
            result(null, {user: userFromDb, token});
        } else {
            console.log("passwords did not match");
            result(new Error("passwords did not match"), null);
        }
    });
};

User.findById = (id, result) => {
    sql.query(`SELECT *
               FROM users
               WHERE id = '${id}'`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found user: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found user with the id
        result({kind: "not_found"}, null);
    });
};

User.updateById = (userId, userUpdates, result) => {
    if (userUpdates.pdfFiles) {
        userUpdates.pdfFiles = JSON.parse(userUpdates.pdfFiles); // Parse the string back into an array
    }
    sql.query(
        `UPDATE users
         SET ?
         WHERE id = ?`,
        [userUpdates, userId],
        (err, res) => {
            if (err) {
                console.log(err);
                result(err, null);
            } else {
                console.log("updated user: ", {id: userId, ...userUpdates});
                result(null, {id: userId, ...userUpdates});
            }
        }
    );
};

User.updatePasswordById = (userId, updatedPassword, result) => {
    sql.query(
        `UPDATE users
         SET password = ?
         WHERE id = ?`,
        [updatedPassword, userId],
        (err, res) => {
            if (err) {
                console.log(err);
                result(err, null);
            } else {
                console.log("updated user: ", {id: userId, password: updatedPassword});
                result(null, {id: userId, password: updatedPassword});
            }
        }
    );
};

User.findByEmail = (userEmail, result) => {
    const query = `SELECT *
                   FROM users
                   WHERE email = "${userEmail}"`;

    sql.query(query, (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
        }

        if (res.length) {
            console.log("found request: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Request with the id
        result({kind: "not_found"}, null);
    });
};

User.findAll = (result) => {
    sql.query(`SELECT *
               FROM users`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("users: ", res);
        result(null, res);
    });
};

User.findAllByRole = (role, result) => {
    const query = `SELECT *
                   FROM users
                   WHERE role = '${role}'`;
    sql.query(query, async (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        if (res.length) {
            console.log("Found users: ", res);
            result(null, res);
            return;
        }
        result({kind: "not_found"}, null);
    });
};

User.deleteById = (id, result) => {
    sql.query(`DELETE
               FROM users
               WHERE id = '${id}'`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.affectedRows === 0) {
            // not found user with the id
            result({kind: "not_found"}, null);
            return;
        }

        // success, user was deleted
        result(null, res);
    });
};

User.updateExpertById = (userId, userUpdates, result) => {
    sql.query(
        `UPDATE users SET ? WHERE id = ?`,
        [userUpdates, userId],
        (err, res) => {
            if (err) {
                console.log(err);
                result(err, null);
            }
            else {
                console.log("updated user: ", {id: userId, ...userUpdates});
                result(null, {id: userId, ...userUpdates});
            }
        }
    );
};


User.updatePdfFilesUrlById = (userId, newPdfFilesUrl, result) => {
    // Fetch the current pdfFilesUrl for the user
    sql.query(
        `SELECT pdfFilesUrl FROM users WHERE id = ?`,
        [userId],
        (err, res) => {
            if (err) {
                console.log(err);
                result(err, null);
                return;
            }

            // Parse the JSON string to an array
            let pdfFilesUrl = JSON.parse(res[0].pdfFilesUrl || "[]");

            // Concatenate the new URLs to the array
            pdfFilesUrl = pdfFilesUrl.concat(newPdfFilesUrl);

            // Stringify the modified array
            pdfFilesUrl = JSON.stringify(pdfFilesUrl);

            // Write the modified array back to the database
            sql.query(
                `UPDATE users
                 SET pdfFilesUrl = ?
                 WHERE id = ?`,
                [pdfFilesUrl, userId],
                (err, res) => {
                    if (err) {
                        console.log(err);
                        result(err, null);
                    } else {
                        console.log("updated user: ", {id: userId, pdfFilesUrl: pdfFilesUrl});
                        result(null, {id: userId, pdfFilesUrl: pdfFilesUrl});
                    }
                }
            );
        }
    );
};
User.deletePdfFilesUrlById = (id, pdfUrl, result) => {
    sql.query(`SELECT pdfFilesUrl
               FROM users
               WHERE id = ?`, [id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log('Fetched user data:', res[0]);
            const pdfFilesUrl = JSON.parse(res[0].pdfFilesUrl);
            const urlIndex = pdfFilesUrl.indexOf(pdfUrl);
            if (urlIndex !== -1) {
                pdfFilesUrl.splice(urlIndex, 1);
            }

            sql.query(`UPDATE users
                       SET pdfFilesUrl = ?
                       WHERE id = ?`, [JSON.stringify(pdfFilesUrl), id], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }
                console.log('Updated user data:', res);
                                result(null, {message: 'File URL removed successfully'});
            });
        } else {
            console.log('User not found:', id);
            result({kind: "not_found"}, null);
        }
    });
};

User.updateProfileImageUrlById = (userId, url, result) => {
    sql.query(
        `UPDATE users
         SET profileImageUrl = ?
         WHERE id = ?`,
        [url, userId],
        (err, res) => {
            if (err) {
                console.log(err);
                result(err, null);
                return;
            } else {
                console.log("updated user: ", {id: userId, profileImageUrl: url});
                result(null, {id: userId, profileImageUrl: url});
            }
        }
    );
};
module.exports = User;
