# top-inventory-app
The Odin Project: Inventory Application Project

A Express/Node.js app for demonstrating use of backend technologies to create a mock inventory management system on the Internet. 

## [Live Demo](https://top-inventory-app.onrender.com/inventory)

## Getting Started
```
git clone https://github.com/bombr90/top-inventory-app.git
cd top-inventory-app
npm install
node dummydata <YOUR DB CONNECTION URI*>
npm start
```

>**Note: You'll need to self-host a mongoDB database or have mongoDB atlas account with a valid DB connection string saved as an environmental variable. Create a '.env' file in the root directory in the following format: **DB_URI = "mongodb+srv://[yourUsername]:[myRealPassword]@cluster0.mongodb.net/inventory_app?w=majority"***

## Built with 
- [Node](https://nodejs.dev/en/)
- [Express](https://expressjs.com/)
- [Pug](https://www.npmjs.com/package/pug)
- [MongoDB](https://cloud.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)