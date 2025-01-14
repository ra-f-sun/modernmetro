import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
} from "../controllers/userController.js";
import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/authMiddlewares.js";

const router = express.Router();

router
  .route("/")
  .post(createUser) //creating user
  .get(authenticate, authorizeAdmin, getAllUsers); //if user is logged in, user is admin, then getting all users. Here authenticate and authorizeAdmin are middlewares whose are checking if an user is logged in and is admin
router.post("/auth", loginUser); //login
router.post("/logout", logoutCurrentUser); //logout

router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile) //if logged in, show the user credentials
  .put(authenticate, updateCurrentUserProfile); //if logged in, allow access to update credentials

// Admin routes
router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserById) //if user is logged in, user is admin, then deleting user.
  .get(authenticate, authorizeAdmin, getUserById) //if user is logged in, user is admin, then getting user.
  .put(authenticate, authorizeAdmin, updateUserById); //if user is logged in, user is admin, then u[dating] user.
export default router;
