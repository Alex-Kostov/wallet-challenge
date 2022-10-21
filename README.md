
# Wallet Challange

# Environment vars
This project uses the following environment variables:

| Name                          | Description                         | Example value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|PORT           | The port which on which the server will start           | 3000      |
|DB_HOST           |   The hostname of the database you are connecting to.         | localhost      |
|DB_USER        | The MySQL user to authenticate as           | root      |
|DB_PASSWORD        | The password of that MySQL user          | password      |
|DB_DATABASE        | The name of the database     | wallet_challenge      |



# Pre-requisites
- Install [Node.js](https://nodejs.org/en/)
- Install [TypeScript](https://www.typescriptlang.org/download) 
- Install [MySQL](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/windows-install-archive.html)


# Getting started
- Clone the repository
```
git clone git@github.com:Alex-Kostov/wallet-challenge.git
```
- Install dependencies
```
cd wallet-challenge
npm install
```
- Create new .env file and add environment variables which are listed on top of this documentation.
- If using Linux make sure the directory has all needed permissions in order for typescript to create new folders and files, if you need help you can check this [link](https://askubuntu.com/questions/719996/how-can-i-give-full-permission-to-folder-and-subfolder/#answer-934702)

- Build and run the project
```
npm run build
npm run start
```
*npm run build* - This command will compile the TypeScript files by running tsc

*npm run start* - This command will first create new wallet_challange database, will create all the needed tables and will add 2 user roles (Admin and Customer).

-  Navigate to `http://localhost:3000/`

# API endpoints

| Url                          | Method                         | Description  | Example data                              |
| ----------------------------- | -------------------------| ------------------------------------------| ------------------------------------ |
|  /          |  GET           |   Provides info about the rest of the endpoints    |  - |
|  /auth/login         |  POST           |   Login, it expects username and password. We have 2 users "**admin**" password: "**admin**" and "**john**" with password "**john**"     |  {"username": "admin, "password": "admin"} |
|  /auth/logout         |  POST           |  Logouts the current logged in user and removes his session    |  - |
|  /users/balance        |  GET           | Return the balance for the currently logged in user, must have corret permissions. Currently both admin and customer can view their balance.   |  - |
|  /wallet/list       |  GET           | Fetches the last 10 or all transactions made by the current user, Currently only the admin has access to this endpoint.   |  - |
|  /wallet/list/{x}   |  GET           | Fetches the last X or all transactions made by the current user, Currently only the admin has access to this endpoint.   |  - |
|  /wallet/deposit/   |  POST           | Deposits money into the balance of the currently logged in user, must have correct permissions. Currently only the admin can deposit moeny   |  {"amount":  100} |
|  /wallet/withdraw/   |  POST           | Withdraws money from the account of the currently logged in user, must have correct permissions and enought funds. Currently only the admin can deposit moeny   |  {"amount":  50} |


## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **dist**                 | Contains the distributable (or output) from your TypeScript build.  |
| **node_modules**         | Contains all  npm dependencies                                                            |
| **src**                  | Contains  source code that will be compiled to the dist dir                               |
| **configuration**        | Application configuration including environment-specific configs 
| **src/controllers**      | Controllers define functions to serve various express routes. 
| **src/lib**              | Common libraries to be used across your app.  
| **src/middlewares**      | Express middlewares which process the incoming requests before handling them down to the routes
| **src/routes**           | Contain all express routes, separated by module/area of application                       
| **src/models**           | Models define schemas that will be used in storing and retrieving data from Application database  |
| **src/monitoring**      | Prometheus metrics |
| **src**/index.ts         | Entry point to express app                                                               |
| package.json             | Contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)   | tsconfig.json            | Config settings for compiling source code only written in TypeScript    
| tslint.json              | Config settings for TSLint code style checking                                                |

# Common Issues

## Linux permissions
When running `npm run build` TypeScript will need the rights to create new dist folder with js files. 
If the project folder does not have the correct permisions to write files this can be an issue.
A fix would be to run `sudo chmod -R 777 .` in the project folder.

Same goes for `npm run start` it will need all permisions in order to create database and tables.