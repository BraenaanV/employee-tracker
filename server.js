//dependencies

var mysql = require("mysql");
var cTable = require("console.table");
var inquirer = require("inquirer");
const { createConnection } = require("net");
const { allowedNodeEnvironmentFlags } = require("process");


//connection

var connect = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    //enter your mysql password here 
    password: "Westmeadow183",
    database: "employees_db"
});

createConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected! ID: " + createConnection.threadId);
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

//update employee role

function updateRole(query) {
    connection.query(query, function(err,res) {
        if (err) throw err;
        console.log("\n")
        console.log(ctable.getTable(res));
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
    connection.query("SELECT id, title FROM role;", function(err,res){
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
                    close();
                })
            })
        }
        
    })
}

//close connection

function close() {
    connection.end();
}