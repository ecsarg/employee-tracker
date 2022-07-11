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
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS departments, roles.salary,
                    CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employees
                    LEFT JOIN roles ON employees.role_id = roles.id
                    LEFT JOIN departments ON roles.department_id = departments.id
                    LEFT JOIN employees manager ON employees.manager_id = manager.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        askUser();
    })
};

// Add a Department
addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: "Enter the name of the department you want to add.",
        }
    ])
    .then(answer => {
        const sql = `INSERT INTO departments (name) VALUES (?)`;
        connection.query(sql, answer.addDepartment, (err, result) => {
            if (err) throw err;
            console.log('Added ' + answer.addDepartment + ' to departments.');
            viewDepartments();
        });
    });
};

// Add a Role
addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'Enter the name of the role you want to add.'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for the role you are adding.'
        }
    ])
    .then(answer => {
        const params = [answer.role, answer.salary];

        const sql = `SELECT name, id FROM departments`;

        connection.query(sql, (err, data) => {
            if (err) throw err;

            const department = data.map(({ name, id }) => ({ name: name, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: 'Select which department this role is in.',
                    choices: department
                }
            ])
            .then (departmentPick => {
                const department = departmentPick.department;
                params.push(department);

                const sql = `INSERT INTO roles (title, salary, department_id)
                    VALUES (?, ?, ?)`;
        
                connection.query(sql, params, (err, results) => {
                if (err) throw err; 
                console.log('Added ' + answer.role + ' to roles.');

                viewRoles();
            });
        });
    });
});
};
        
// Add an Employee
addEmployee = () => {
    inquirer.prompt ([
        {
            type: 'input',
            name: 'firstName',
            message: "Enter employee's first name"
        },
        {
            type: 'input',
            name: 'lastName',
            message: "Enter employee's last name."
        }
    ])
    .then(answer => {
        const params = [answer.firstName, answer.lastName]

        const rolesSql = `SELECT roles.id, roles.title FROM roles`;

        connection.query(rolesSql, (err, data) => {
            if (err) throw err;

            const roles = data.map(({ id, title }) => ({ name: title, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'Select which role the employee has.',
                    choices: roles
                }
            ])
            .then(rolesChoice => {
                const roles = rolesChoice.roles;
                params.push(roles);

                const managerSql = `SELECT * FROM employees`;

                connection.query(managerSql, (err, data) => {
                    if (err) throw err;

                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Select the employee's manager.",
                            choices: managers
                        }
                    ])
                    .then(managersChoice => {
                        const manager = managersChoice.manager;
                        params.push(manager);

                        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`;

                        connection.query(sql, params, (err, results) => {
                            if (err) throw err;
                            console.log('Employee has been added.');

                            viewEmployees();
                        });
                    });
                });
            });
        });
    });
};

// Update an Employee Role
updateEmployeeRole = () => {
    const employeesSql = `SELECT * FROM employees`;

    connection.query(employeesSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Select which employee you would like to update.',
                choices: employees
            }
        ])
        .then(employeeChoice => {
            const employees = employeeChoice.name;
            const params = [];
            params.push(employees);

            const rolesSql = `SELECT * FROM roles`;

            connection.query(rolesSql, (err, data) => {
                if (err) throw err;

                const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'roles',
                        message: "Enter employee's new role.",
                        choices: roles
                    }
                ])
                .then(rolesChoice => {
                    const roles = rolesChoice.roles;
                    params.push(roles);

                    let employee = params[0]
                    params[0] = roles
                    params[1] = employee

                    const sql = `UPDATE employees SET role_id =? WHERE id = ?`;

                    connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log("Employee's role has been updated.");

                        viewEmployees();
                    });
                });
            });
        });
    });
};