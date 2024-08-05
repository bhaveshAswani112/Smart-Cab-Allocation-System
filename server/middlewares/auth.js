import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const verifyJWT = asyncHandler(async (req,res,next)=>{
    try {
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!accessToken){
            return res.status(404).json(
                new ApiResponse(404,{},"User not authorized")
            )
        }
    
        const decodedToken = await jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)?.select(
            "-password -refreshToken"
        )
        if(!user){
            return res.status(404).json(
                new ApiResponse(404,{},"User not authorized")
            )
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500,{},"Error from backend side")
        )
    }
    
})


export {verifyJWT}