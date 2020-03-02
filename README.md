# What-ToDo-NodeJS
A simple to-do app created using NodeJS, Express Server, MySQL DB, and traditional frontend (HTML,JS,&amp; CSS)

### Files & Directories:
- server.js
- public/
- package.json

### Tools:
- Node JS 
- Express JS
- HTML, Javascript, CSS
- Bootstrap Framework
- MySQL Database (Hosted on Google Cloud)

### Starting in Development Mode:
- Navigate to the HEAD directory of the project.
- Run: npm install (it will install all the modules from package.json)
- Run: npm start (it will start the project in development mode)
- Open: http://localhost:3000 (in the browser for development mode)

### Accessing MySQL on Google Cloud:
- MySQL instance is running on Google Cloud.
- Credentials for connecting to db are stored in .env file (gitignored) as a copy on developers' local computer.
- database.js is responsible for establishing connection with the remote database.
- Developers need SSL certificates for server,client,and a private key to make changes to the remote database from local SQL editors.
- The project is automatically connected to the remote database and you can still run queries from inside of the .js script.
- If you face the timeout errors with SQL database, contact me (Vivek) and I will add your public IP address on Google Cloud for validation.
