# ![Node/Express/Mongoose Example App](project-logo.png)

[![Build Status](https://travis-ci.org/anishkny/node-express-realworld-example-app.svg?branch=master)](https://travis-ci.org/anishkny/node-express-realworld-example-app)

> ### NestJS (Express + Mongoose) codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) API spec.


----------

# Getting started

## Installation

Clone the repository

    git clone git@github.com:lujakob/nestjs-realworld-example-app.git

Switch to the repo folder

    cd nestjs-realworld-example-app
    
Install dependencies
    
    npm install

Copy config file and set JsonWebToken secret key

    cp src/config.ts.example src/config.ts
    
----------

## Database

The example codebase uses [Typeorm](http://typeorm.io/) with a mySQL database.

Copy Typeorm config example file for database settings

    cp ormconfig.json.example ormconfig.json
    
Set mysql database settings in ormconfig.json

    {
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "username": "your-mysql-username",
      "password": "your-mysql-password",
      "database": "nestjsrealworld",
      "entities": ["src/**/**.entity{.ts,.js}"],
      "synchronize": true
    }
    
Start local mysql server and create new database 'nestjsrealworld'

On application start, tables for all entities will be created.

----------

## NPM scripts

- `npm start` - Start application
- `npm run start:watch` - Start application in watch mode
- `npm run test` - run Jest test runner 
- `npm run start:prod` - Build application

----------

## API Specification

This application adheres to the api specifications set by the [Thinkster](https://github.com/gothinkster) team. This helps mix and match any backend with any other frontend without conflicts.

> [Full API Spec](https://github.com/gothinkster/realworld/tree/master/api)

More information regarding the project can be found here https://github.com/gothinkster/realworld

----------
 
# Authentication
 
This applications uses JSON Web Token (JWT) to handle authentication. The token is passed with each request using the `Authorization` header with `Token` scheme. The JWT authentication middleware handles the validation and authentication of the token. Please check the following sources to learn more about JWT.

----------
 
# Swagger API docs

This example repo uses the NestJS swagger module for API documentation. [NestJS Swagger](https://github.com/nestjs/swagger) - [www.swagger.io](https://swagger.io/)        