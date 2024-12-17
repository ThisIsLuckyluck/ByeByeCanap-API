# ByeByeCanap-API

## Built-in API Mongo-Express-Node.Js

The API has been designed to work with [mongoDB](https://www.mongodb.com/) a NoSQL (non-relational) database. All requests have been implemented based on the [official MongoDB documentation](https://www.mongodb.com/docs/). If you'd like to suggest changes or improvements to this API, feel free to create an issue with the label "Question".

## Tools Used

To make this API I used some frameworks and libs. Here's the list :

- Express.js (to make the local server and routes)
- Bcrypt (to hash the password)
- uid2 (Generate random token using cryptographic's method )
- dotenv (to create env variable)
- moment (to format date like wanted)
- swagger (an GUI API documentation to improve understanding of the request build, Btw you can acces to the swagger with the following [url](http://localhost:3000/doc/api/) )

## Get it locally

To get it locally you can do this if you use https:

```bash
git clone https://github.com/ThisIsLuckyluck/ByeByeCanap-API.git
```

Otherwise if you want to get it via SSH you can also do this :

```bash
git clone git@github.com:ThisIsLuckyluck/ByeByeCanap-API.git
```

## Package installations

### Using NPM

```bash
npm i
```

### Using YARN

```bash
yarn install
```

## Set up environment

If you want to run this API locally you must create a ".env" files in the root of the projet, or just rename the ".env-example" file by ".env" and replacing the CONNECTION_STRING value by yours

And it's done !

## Run it

Once everything is set you can run it by multiple ways.

### Run it using NPM

To run it using npm you can do :

```bash
npm start
```

### Run it using YARN

To run it using Yarn you can do :

```bash
yarn start
```

### Run it using Nodemon (recommended)

To run it using nodemon you can do :

```bash
nodemon
```

#### Why I recommend nodemon

Nodemon is a simple tool to run your BACKEND locally with the ability to be dynamic.
I mean if you do a change your BACKEND will be restarted automatically instead of coming back at your terminal each time you do a change with npm or yarn.

Since I put nodemon as a devDependencies you don't have to installed it yourself but if you are interested about this tool you can see their documentation on their official website [here](https://www.npmjs.com/package/nodemon).
