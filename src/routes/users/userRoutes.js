import isAuthenticated from "../../middleware/isAuthenticated.js";
import isAuthorized from "../../middleware/isAuthorized.js";
import { getUsers, createUser, patch, remove, getUserWithId, getUserWithDisplayName, getUserWithToken } from "../../controllers/users/controller.js"
import express from "express"
const router = express.Router();
router.get('/users', [isAuthenticated, isAuthorized({ hasRole: ['admin', 'moderator'] }), getUsers])
router.get('/users/:id', [isAuthenticated, isAuthorized({ hasRole: ['admin', 'moderator'], allowSameUser: true }), getUserWithId])
router.get("/getUserWithDisplayName/:displayName", [isAuthenticated, isAuthorized({ hasRole: ['admin', "user", "moderator"] }), getUserWithDisplayName])
router.get("/user/:token", [isAuthenticated, isAuthorized({ hasRole: ['user', "moderator", "admin"] }), getUserWithToken])
router.post('/users',
//  [isAuthenticated, isAuthorized({ hasRole: ['admin'] }),
 createUser
// ]
)
router.patch('/users/:id', [isAuthenticated, isAuthorized({ hasRole: ['admin'], allowSameUser: true }), patch])
router.delete('/users/:id', [isAuthenticated, isAuthorized({ hasRole: ['admin'] }), remove]);

export default router;