--Department seeds

INSERT INTO department (name)
VALUES ("Engineering");

INSERT INTO department (name)
VALUES ("HR");

INSERT INTO department (name)
VALUES ("Stores");

--role seeds

INSERT INTO role (title, salary, department_id)
VALUES ("Engineer", 80000.00, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Human Resources", 750000.00, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Storeman", 50000.00, 3);

--employee seeds

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jane", "Doe", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Peter", "Doe", 3, 1);