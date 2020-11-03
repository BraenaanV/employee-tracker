//dependencies

var mysql = require("mysql");
var cTable = require("console.table");
var inquirer = require("inquirer");
const { createConnection } = require("net");
const { allowedNodeEnvironmentFlags } = require("process");


//connection

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    //enter your mysql password here 
    password: "Westmeadow183",
    database: "employees_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected! ID: " + connection.threadId);
    employeeApp();
});

function employeeApp() {
    //view sql data
    const viewDepartment = "SELECT id, name FROM department;";
    const viewEmployees = "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name FROM ((employee inner JOIN role ON employee.role_id = role.id) inner JOIN department ON role.department_id = department.id);";
    const viewRoles = "SELECT department_id, title, salary FROM role;"

    // start inquirer questions

    inquirer.prompt({
        name: "start",
        type: "list",
        message: "Select from:",
        choices: [
            "View all departments",
            "View all employees",
            "View all roles",
            "Add department",
            "Add employee",
            "Add role",
            "Change role",
            "Close"
        ]
    }).then(function(response){
        switch (response.start) {
            case "View all departments":
                viewTable(viewDepartment);
                break;
            case "View all employees":
                viewTable(viewEmployees);
                break;
            case "View all roles":
                viewTable(viewRoles);
                break;
            case "Add department":
                addDepartment();
                break;
            case "Add employee":
                addEmployee();
                break;
            case "Add role":
                addRole();
                break;
            case "Change role":
                updateRole();
                break;
            case "Close":
                connection.end();
                break;
        }
    })
}

//query sql table

function viewTable(query) {
    connection.query(query, function(err,res){
        if (err) throw err;
        console.log("\n")
        console.log(cTable.getTable(res));
        employeeApp();
    })
};

//add new department

function addDepartment() {
    inquirer.prompt([
        {
            message: "New department name",
            name: "newDepartment"
        }
    ]).then(function(answer) {
        connection.query("INSERT INTO department (name) VALUES (?)", [answer.newDepartment], function(err, res) {
            if (err) throw err;
            console.log(`Added ${answer.newDepartment}`);
            employeeApp();
        })
    })
}

//add new employee

function addEmployee() {
    var query = "SELECT title, id FROM role;";
    connection.query(query, function(err, res) {
        var rawResp = res;
        var roleList = [];
        var roleId;
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            roleList.push(res[i].title);
        }
        promptEmployee()
        async function promptEmployee(){
            await inquirer.prompt([
                {
                    message: "What is their first name?",
                    name: "firstname"
                },
                {
                    message: "What is their last name",
                    name: "lastname"
                },
                {
                    type: "list",
                    message: "Select their role:",
                    name: "role",
                    choices: roleList
                }
            ]).then(function(answer) {
                roleId = rawResp[roleList.indexOf(answer.role)].id;
                connection.query("INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)", 
                [answer.firstname, answer.lastname, roleId], function (err, res) {
                    if (err) throw err;
                })
            employeeApp()
        })
    }
    })
};

//add a new role

function addRole() {
    connection.query("SELECT id, name FROM department", function(err, res) {
        if (err) throw err;
        var newRoleList = [];
        var departmentId;
        console.log(cTable.getTable(res));
        for (var i = 0; i < res.length; i++) {
            newRoleList.push({id: res[i].id, name: res[i].name});
        }
        roleQuestions();

        function roleQuestions() {
            inquirer.prompt([
                {
                    type: "list",
                    message: "Pick a department for this role",
                    name: "deptName",
                    choices: newRoleList
                },
                {
                    message: "Enter role title",
                    name: "roleName"
                },
                {
                    message: "Enter salary for this role (Must be a number, with up to 2 decimals",
                    name: "salary"
                }
            ]).then(function(answer) {
                for (var i = 0; i < newRoleList.length; i++) {
                    if (answer.deptName == newRoleList[i].name) {
                        departmentId = newRoleList[i].id;
                    }
                }
                connection.query("INSERT INTO role (title, salary, department_id) VALUES (?,?,?)", [answer.roleName, answer.salary, departmentId], function(err, res) {
                    if (err) throw err;
                    console.log(`Created ${answer.roleName}`);
                    employeeApp();
                })
            })
        }
    })
}

//update an employee's role

function updateRole(query) {
    connection.query(query, function(err,res) {
        if (err) throw err;
        console.log("\n")
        console.log(cTable.getTable(res));
        updatePerson();

    function updatePerson() {
        inquirer.prompt([{
            message: "Enter employee ID",
            name: "person"

        }]).then(function(answer){
            newRole(answer.person);
        });
    };
    })
};

function newRole(newRoleEmployeeID) {
    connection.query("SELECT id, title FROM role;", function(err,res) {
        if(err) throw err;
        var roleList=[];
        var titles=[];
        var newRoleID=[];
        for (var i = 0; i < res.length; i++) {
            roleList.push({id: res[i].id, title: res[i].title})
            titles.push(res[i].title)
        }
        updateRoleInquire();

        function updateRoleInquire() {
            inquirer.prompt([
                {
                    type: "list",
                    name: "pickrole",
                    message: "Pick the new role",
                    choices: titles
                }
            ]).then(function(answer){
                for (var i = 0; o < roleList.length; i++) {
                    if (roleList[i].title == answer.chosenRole) {
                        newRoleID = roleList[i].id;
                    }
                }
                connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [newRoleID, newRoleEmployeeID], function(err, res) {
                    if (err) throw err;
                    console.log("Update complete!");
                    employeeApp();
                })
            })
        }
        
    })
};
