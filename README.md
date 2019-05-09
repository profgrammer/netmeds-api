# netmeds-api

api endpoints for netmeds-angular project.

## Required Software

[NodeJS](https://nodejs.org/en/download/)

## Steps

* Clone this repository.
* `cd` into it and type `npm install` on the command line to install all dependencies.
* Run `npm start` to start the server. 

## Endpoints

* `GET /employees?page=pageNo&limit=limit` : Returns a paginated list of employees with given page number and limit.
* `GET /employees:id` : Returns details of a single employee having id of `id`.
* `POST /employees` : Add an employee to the database.
* `PATCH /employees/:id` : Update details of employee with id of `id`.
* `GET /employees/search/:name` : Returns details of all employees with names matching `name`.
* `DELETE /employees/:id` : Deletes the employee with id of `id` from the database.

---
**NOTE**

The `POST` and `PATCH` requests need a form-data body, with the following attributes: 

name: `string`,
salary: `number`,
dob: `Date`,
skills: `string[]`,
profilePhoto: `blob` (image upload)

---
