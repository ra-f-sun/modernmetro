import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

//User validation
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body; //requesting user credentials from the user

  // if any field is missing, this error will be thrown
  if (!username || !email || !password) {
    throw new Error("Please fill in all the input fields!");
  }

  //Checking if am user (email) already exists or not
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).send("User already exists");
  }

  //Decrypting the password given by the user into a hash code
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ username, email, password: hashedPassword });

  //Trying to save the user. If there is not error, it will successfully save the user into DB. if not, it will throw the respective error.
  try {
    await newUser.save();
    createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//Login section
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body; //Requesting email and password to perform login
  const existingUser = await User.findOne({ email }); //Collecting the email given by the user.

  //If the email is already existing, it will run the if block. Then compare the given password with the hashed code (using bcrypt because). But if the email doesn't exist, it will not compare password
  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    //if the password is valid, it will perform login.
    if (isPasswordValid) {
      createToken(res, existingUser._id);
      res.status(201).json({
        message: "Logged in successfully",
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });
      return;
    } else {
      res.send({ message: "Password is not valid" });
    }
  } else {
    res.send({ message: "email not found" });
  }
});

//logout section
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged Out successfully" });
});

//Getting all user
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

//Getting User profile by the user himself
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//Updating User by the user himself
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//Deleting User by the admin
const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin");
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    throw new Error("No user found");
  }
});

//Admin getting a specific user credentials
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//Admin updating a specific user
const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin) || Boolean(user.isAdmin);

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};
