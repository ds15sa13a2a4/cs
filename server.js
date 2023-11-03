import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import http from 'http';
import UserRouter from "./src/routes/users/userRoutes.js";
import ChatRouter from "./src/routes/chats/chatRoutes.js";
import AuthRouter from "./src/routes/users/authRoutes.js"
import FireBaseRouter from "./src/routes/firebaseRouter.js";
import PasswordRouter from "./src/routes/passwordRouter.js";
import costumeErrorHandler from "./src/error/costumErrorHandler.js";
dotenv.config({
  path: "./src/config/config.env"
});
const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
import { Server } from "socket.io";
const server = http.createServer(app);
const socketIO = new Server(server, {
  cors: {
    origin: '*',
  },
});
socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  //sends the message to all the users on the server
  socket.on('enteredTheChat', (data) => {
    socketIO.emit('enteredTheChatResponse', data);
  });
  socket.on('message', (data) => {
    socketIO.emit('messageResponse', data);
  });



  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });
});

server.listen(3002, () => {
  console.log("socket listens on port", 3002);

})
app.use("/", UserRouter, ChatRouter, FireBaseRouter, PasswordRouter, AuthRouter);

// Error Middleware
app.use(costumeErrorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("App started on port", port);
});
