const express = require("express");
const cors = require("cors");
const contactRouter = require("./routers/contactsRouter");
const mongoose = require('mongoose');

require("dotenv").config();

module.exports = class UserList {
  constructor() {
    this.server = null;
  }
  async start() {
    this.initServer();
    this.initMiddlewares();
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

  initRoutes() {
    this.server.use("/api/contacts", contactRouter);
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("Start listening server", process.env.PORT);
    });
  }
  async initDataBase() {
    await mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false} )
  }
};