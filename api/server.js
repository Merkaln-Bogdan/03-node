const express = require("express");
const cors = require("cors");
const usersRouter = require("./routers/usersRouter")
const contactsRouter = require("./routers/contactsRouter");
const mongoose = require('mongoose');

require("dotenv").config();

module.exports = class UserList {
  constructor() {
    this.server = null;
  }
  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initUserRoutes()
    this.initRoutes();
    await this.initDataBase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors({ origin: "http://localhost:3000" }));
  }
  initUserRoutes() {
    this.server.use("/api/user", usersRouter);
  }
  initRoutes() {
    this.server.use("/api/contacts", contactsRouter);
  }
  

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("Start listening server", process.env.PORT);
    });
  }
  async initDataBase() {
  try{
      await mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true, useUnifiedTopology: true } )
    }catch(err){
      console.log(err);
      process.exit(1);
    }
    console.log("Database connection successful");
  }
};