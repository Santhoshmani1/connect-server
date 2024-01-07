# Connect server

### What is connect server ? 
Connect server is a REST API service that backs [Connect client](https://connectdev.vercel.app)

### Technologies used
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="80" height="80"/> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="80" height="80"/> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" alt="mongodb" width="80" height="80"/>


## Project structure
```
|-- middleware
|   |--auth.js // for jwt token generation and verification
|
|-- routes    // Router Middleware for express app  
|   |-- userRouter.js
|   |-- membersRouter.js
|   |-- teamsRouter.js
|   |-- hackathonsRouter.js
|
|-- schemas
|
|--.gitignore
|-- index.js
|-- package-lock.json
|-- package.json
```

### Features
- User Authorization with Json Web Tokens (**JWT**)
- Password Hashing with Bcrypt.
- API support for users & teams in real time.


