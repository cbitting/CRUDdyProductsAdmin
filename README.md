# CRUDdy Products Inc.

A sample CRUD admin using Angular, Express (for REST API) & Angular Material components.

## Setup

Run `npm i` in the root to install the needed packages.

Run `npm i` in the client\CRUDdyClient folder to install the needed packages.

## Development server

Run `npm start` (in the root) to start the dev server and Angular dev client. Navigate to `http://localhost:4200/`.

I'm using **concurrently** to run the server + client together.

The api is using the file based db **lowdb** to hold the data (it's a little limited on features - but super quick + simple).

## API Documentation

Visit `http://localhost:4200/api/api-docs` for the OpenAPI / Swagger API docs.

## For the sake of the exercise and time - stuff NOT implemented
- Tests
- Production Deploy
- Security
