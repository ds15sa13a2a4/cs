import express from "express";
import isAuthenticated from "../../middleware/isAuthenticated.js";
import isAuthorized from "../../middleware/isAuthorized.js";
import { createChat, createUserChat, deleteChatMessage, getChats, getUserChats, removeUserFromChat, setUserChat, uploadMessage, uploadMessageFunction, addSeenToMessages, uploadMessageWithImage, getLastChatMessage } from "../../controllers/chats/controller.js";
const router = express.Router();
router.get("/userChats/:id(\\S+)", [isAuthenticated, isAuthorized({ hasRole: ['admin', "user", "moderator"] }), getUserChats])
router.get("/chats/:id(\\S+)", [isAuthenticated, isAuthorized({ hasRole: ['admin', "user", "moderator"] }), getChats])
router.get("/getLastChatMessage/:id(\\S+)", [isAuthenticated, isAuthorized({ hasRole: ['admin', "user", "moderator"] }), getLastChatMessage])
router.post("/addSeenToMessages", [isAuthenticated, isAuthorized({ hasRole: ['admin', "user", "moderator"] }), addSeenToMessages]);
router.post("/uploadMessageWithImage", [isAuthenticated, isAuthorized({ hasRole: ['admin', "user", "moderator"] }), uploadMessageWithImage]);
router.post("/uploadMessage", [isAuthenticated, isAuthorized({ hasRole: ['admin', "user", "moderator"] }), uploadMessage]);
router.post("/uploadMessageFunction", [isAuthenticated, isAuthorized({ hasRole: ['admin', "user", "moderator"] }), uploadMessageFunction]);
router.post("/createChat", [isAuthenticated, isAuthorized({ hasRole: ['admin', "user", "moderator"] }), createChat]);
router.post("/createUserChat", [isAuthenticated, isAuthorized({ hasRole: ['admin', "user", "moderator"] }), createUserChat]);
router.post("/setUserChat", [isAuthenticated, isAuthorized({ hasRole: ['admin', "user", "moderator"] }), setUserChat]);
router.delete("/message", [isAuthenticated, isAuthorized({ hasRole: ['admin'] }), deleteChatMessage]);
router.delete("/removeUserFromChat", [isAuthenticated, isAuthorized({ hasRole: ['admin', "user", "moderator"] }), removeUserFromChat]);

export default router;