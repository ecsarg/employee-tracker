const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

require('dotenv').config()

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Vanderbilt1',
    database: 'tracker'
});

connection.connect(err => {
    if (err) throw err;
    console.log('error in connection');
    afterConnection();
});

afterConnection = () => {
    console.log("***************************")
    console.log("*                          ")
    console.log("*     EMPLOYEE MANAGER     ")
    console.log("*                          ")
    console.log("***************************")
};

const askUser = () => {
    inquirer.prompt([
    {
        type: 
    }
    ])
}

module.exports = db;