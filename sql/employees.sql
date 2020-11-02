DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE emoloyees_db;

CREATE TABLE department(
    id INTEGER(10) AUTO_INCREMENT NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE role(
    id INTEGER(10) AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL(10,2)
    department_id INTEGER (10),
    PRIMARY KEY (id)
);

CREATE TABLE employee(
    id INTEGER(10) AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT(10),
    manager_id INT(10),
    PRIMARY KEY (id)
)