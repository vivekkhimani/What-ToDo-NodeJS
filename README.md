# What-ToDo-NodeJS

## USERS AND GENERAL AUDIENCE GUIDE:

### Introduction:
A simple to-do app created using NodeJS, Express Server, MySQL DB, and traditional frontend (HTML,JS,&amp; CSS)

### What's different?:
- Machine Learning based recommendations for the new tasks based on the tasks found in the database.
- Live Countdown timer to make it more intuitive for the users to track the tasks.
- Due Date & Priority based sorting to help the users distinguish between the less and more important tasks
- User Privacy & Security taken care off by the usage of latest hashing and salting practices while implementing the login authentication
- The database hosted on Google Cloud
- Extensive usage of browser caching for quicker display of results after querying the machine learning model

### Usage:
The web app is completed but not hosted as of now. Also, as the MySQL is hosted on Google Cloud not everyone will have access to it. As a result, the app will crash if anyone else except the core contributors will try to run the app. 

Yet, if you want to use it and contribute to the project, please contact one of the contributors to get appropriate access. We tried to make the database open to public but someone wiped out all our tables (fortunately we had a backup) so we are not planning to do that.

If you want to see some glimpses of the final product, please navigate to the "screenshots/" directory and find it there.


## DEVELOPERS GUIDE:

### Files & Directories:
- server.js
- database.js
- public/
- sql_scripts/
- package.json
- package-lock.json

### Tools:
- Node JS 
- Express JS
- HTML, Javascript, CSS
- Bootstrap Framework
- MySQL Database (Hosted on Google Cloud)

### Node Packages:
- Express
- Request
- Body-Parser
- Crypto
- Express-Session
- Tensorflowp-models (pre-trained Google doc to vec)
- Compute-cosine-similarity

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
- If you face the timeout errors with SQL database, contact me (Vivek) and I will add your public IP address on Google Cloud for validation. (For external developers willing to play around and contribute, feel free to reach us)

### Some Unique Approaches worth knowing:
