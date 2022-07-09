INSERT INTO departments (name)
VALUES
('Finance'),
('Legal'),
('Engineering'),
('Sales');

INSERT INTO roles (title, salary, department_id)
VALUES
('Sales Associate', 65000, 4),
('Sale Associate', 72000, 4),
('Lawyer', 125000, 2),
('Legal Assistant', 35000, 2),
('Front End Developer', 85000, 3),
('Back End Developer', 90000, 3),
('Accountant', 75000, 1),
('Book-keeper', 53000, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Alex', 'Smith', 5, 6),
('Jennifer', 'Jones', 8, 7),
('Mike', 'Ladette', 2, NULL),
('Sheryl', 'Frost', 1, 2),
('Allison', 'Rodriguez', 3, NULL),
('Joseph', 'Roberts', 7, NULL),
('Danielle', 'Bailey', 4, 3),
('Miller', 'Lawrence', 6, NULL);