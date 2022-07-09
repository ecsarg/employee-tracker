const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Vanderbilt1',
    database: 'tracker'
});

connection.connect(err => {
    if (err) throw err;
    // console.log('error in connection');
    afterConnection();
});

afterConnection = () => {
    console.log("***************************")
    console.log("*                         *")
    console.log("*     EMPLOYEE MANAGER    *")
    console.log("*                         *")
    console.log("***************************")

    askUser();
};

const askUser = () => {
    inquirer.prompt([
    {
        type: 'list',
        name: 'options',
        message: 'What would you like to choose?',
        choices: ['View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role',
                'No Further Action']
    }
    ])
    .then((answers) => {
        const { options } = answers;
        if (options === 'View All Departments') {
            viewDepartments();
        }

        if (options === 'View All Roles') {
            viewRoles();
        }

        if (options === 'View All Employees') {
            viewEmployees();
        }

        if (options === 'Add a Department') {
            addDepartment();
        }

        if (options === 'Add a Role') {
            addRole();
        }

        if (options === 'Add an Employee') {
            addEmployee();
        }

        if (options === 'Update an Employee Role') {
            updateEmployeeRole();
        }

        if (options === 'No Further Action') {
            connection.end()
        };
    });
};

// View All Departments
viewDepartments = () => {
    console.log("Showing all departments:");
    const sql = `SELECT departments.id AS id, departments.name AS departments FROM departments`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        askUser();
    });
};

// View All Roles
viewRoles = () => {
    console.log("Showing all roles:");
    const sql = `SELECT roles.id, roles.title, departments.name AS departments 
                FROM roles 
                INNER JOIN departments ON roles.department_id = departments.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        askUser();
    })
};

// View All Employees
viewEmployees = () => {
    console.log("Showing all employees:");
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS  department, roles.salary,
                    CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employees
                    LEFT JOIN roles ON employees.role_id = roles.id
                    LEFT JOIN departments ON roles.department_id = departments.id
                    LEFT JOIN employees manager ON employees.manager_id = manager.id`;

    connnection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        askUser();
    });
};

// Add a Department

// Add a Role

// Add an Employee

// Update an Employee Role


