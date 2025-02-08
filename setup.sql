CREATE TABLE IF NOT EXISTS requests (
    id varchar(36) NOT NULL,
    nr INT(11) NOT NULL AUTO_INCREMENT,
    question TEXT NOT NULL,
    email varchar(255) NOT NULL,
    user_career varchar(255),
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    pending BOOLEAN NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY nr (nr)
    ) AUTO_INCREMENT=10;

CREATE TABLE IF NOT EXISTS users (
  id varchar(36) NOT NULL,
  firstname varchar(255),
  name varchar(255),
  email varchar(255) NOT NULL UNIQUE,
  career varchar(255),
  socialMediaProfile varchar(255),
  aboutMe TEXT,
  pdfFiles TEXT,
  pdfFilesUrl TEXT,
  profileImageUrl TEXT,
  password varchar(255) NOT NULL,
  role varchar(255) NOT NULL DEFAULT 'userYP',
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS answers (
  id varchar(36) NOT NULL,
  id_request varchar(36) NOT NULL,
  type_user varchar(255) NOT NULL DEFAULT 'expert',
  id_user varchar(36) NOT NULL DEFAULT ' ',
  text TEXT(500) NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);