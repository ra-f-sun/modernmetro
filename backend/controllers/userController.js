import asyncHandler from "../middlewares/asyncHandler.js"
import User from "../models/userModel.js"

const createUser= asyncHandler(async (req,res)=>{
    res.send("hello")
}) 

export {createUser}