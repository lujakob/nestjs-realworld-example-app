# ![Node/Express/Mongoose Example App](project-logo.png)

[![Build Status](https://travis-ci.org/anishkny/node-express-realworld-example-app.svg?branch=master)](https://travis-ci.org/anishkny/node-express-realworld-example-app)

> ### NestJS codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) API spec.


----------

# Getting started

## Installation

Clone the repository

    git clone https://github.com/lujakob/nestjs-realworld-example-app.git

Switch to the repo folder

    cd nestjs-realworld-example-app
    
Install dependencies
    
    npm install

Copy config file and set JsonWebToken secret key

    cp src/config.ts.example src/config.ts
    
----------

## Database

The codebase contains examples of two different database abstractions, namely [TypeORM](http://typeorm.io/) and [Prisma](https://www.prisma.io/). 
    
The branch `master` implements TypeORM with a mySQL database.

The branch `prisma` implements Prisma with a mySQL database.

----------

##### TypeORM

----------

Create a new mysql database with the name `nestjsrealworld`\
(or the name you specified in the ormconfig.json)

Copy TypeORM config example file for database settings

    cp ormconfig.json.example
    
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

##### Prisma

----------

To run the example with Prisma checkout branch `prisma`, remove the node_modules and run `npm install`

Create a new mysql database with the name `nestjsrealworld-prisma` (or the name you specified in `prisma/.env`)

Copy prisma config example file for database settings

    cp prisma/.env.example prisma/.env

Set mysql database settings in prisma/.env

    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

To create all tables in the new database make the database migration from the prisma schema defined in prisma/schema.prisma

    npx prisma migrate save --experimental
    npx prisma migrate up --experimental

Now generate the prisma client from the migrated database with the following command

    npx prisma generate

The database tables are now set up and the prisma client is generated. For more information see the docs:

- https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project-typescript-mysql


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

## Start application

- `npm start`
- Test api with `http://localhost:3000/api/articles` in your favourite browser

----------

# Authentication
 
This applications uses JSON Web Token (JWT) to handle authentication. The token is passed with each request using the `Authorization` header with `Token` scheme. The JWT authentication middleware handles the validation and authentication of the token. Please check the following sources to learn more about JWT.

----------
 
# Swagger API docs

This example repo uses the NestJS swagger module for API documentation. [NestJS Swagger](https://github.com/nestjs/swagger) - [www.swagger.io](https://swagger.io/)        

# Como rodar o projeto localmente

## Pré-requisitos

- Node.js 16.x ou superior
- npm ou yarn
- Docker e Docker Compose (opcional, mas recomendado)

## 1. Rodando com Docker (recomendado)

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd nestjs-realworld-example-app
   ```

2. **Suba os containers:**
   ```bash
   docker-compose up --build
   ```
   Isso irá:
   - Subir o banco de dados MySQL já configurado
   - Subir a aplicação em modo desenvolvimento (hot reload)

3. **Acesse a aplicação:**
   - API: http://localhost:3000/api
   - Documentação Swagger: http://localhost:3000/api/docs (se habilitado)

4. **Parar os containers:**
   ```bash
   docker-compose down
   ```

## 2. Rodando sem Docker (apenas Node.js)

1. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

2. **Configure o banco de dados:**
   - Crie um banco MySQL local ou use um banco externo.
   - Copie o arquivo de exemplo:
     ```bash
     cp src/config.ts.example src/config.ts
     ```
   - Edite `src/config.ts` com as credenciais do seu banco.

3. **Rode as migrations (se necessário):**
   - O projeto está configurado para sincronizar as entidades automaticamente (`synchronize: true`), mas em produção recomenda-se usar migrations.

4. **Inicie a aplicação:**
   ```bash
   npm run start:dev
   # ou
   yarn start:dev
   ```

5. **Acesse a aplicação:**
   - API: http://localhost:3000/api

## 3. Rodando os testes de aceitação

- **Com Docker:**
  ```bash
  docker-compose run --rm app npm run test:acceptance
  ```
- **Localmente:**
  ```bash
  npm run test:acceptance
  ```

## 4. Gerando relatório visual dos testes de aceitação

Após rodar os testes de aceitação, gere o relatório:
```bash
node scripts/generate-acceptance-report.js
```
O relatório estará em `coverage/acceptance-report.html`.

---

Dúvidas? Abra uma issue ou consulte os scripts e exemplos no repositório.
