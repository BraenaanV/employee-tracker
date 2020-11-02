//dependencies

var mysql = require("mysql");
var cTable = require("console.table");
var inquirer = require("inquirer");
const { createConnection } = require("net");


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
    
}