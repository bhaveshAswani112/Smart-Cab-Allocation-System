import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

const generateAccesAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
    try {
        const { fullName, email, password,role } = req.body;
        if ([fullName, email, password].some((field) => field?.trim() === "")) {
            return res.status(400).json(new ApiResponse(400, {}, "All fields are required"));
        }

        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(400).json(new ApiResponse(400, {}, "User with email already exists."));
        }

        const user = await User.create({ fullName, email, password,
            role : role ? role : "user"
         });
        const createdUser = await User.findById(user._id)?.select("-password -refreshToken");
        if (!createdUser) {
            return res.status(500).json(new ApiResponse(500, {}, "Error while registering the user"));
        }

        return res.status(200).json(new ApiResponse(200, { createdUser }, "User registered successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, {}, "Error during user registration"));
    }
});

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json(new ApiResponse(400, {}, "Email is required"));
        }
        if (!password) {
            return res.status(400).json(new ApiResponse(400, {}, "Password is required"));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json(new ApiResponse(400, {}, "User does not exist. Please register first."));
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(400).json(new ApiResponse(400, {}, "Incorrect password entered."));
        }

        const { accessToken, refreshToken } = await generateAccesAndRefreshToken(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true
        };

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, {
                user: loggedInUser,
                refreshToken,
                accessToken
            }, "User logged in successfully"));
    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, {}, "Error during login"));
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    try {
        const user_id = req?.user?._id;
        await User.findByIdAndUpdate(
            user_id,
            {
                $unset: {
                    refreshToken: undefined
                }
            },
            {
                new: true
            }
        );

        const options = {
            httpOnly: true,
            secure: true
        };

        return res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User logged out successfully"));
    } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500, {}, "Error during logout"));
    }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
        if (!incomingRefreshToken) {
            return res.status(401).json(new ApiResponse(401, {}, "Unauthorized request"));
        }

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);
        if (!user) {
            return res.status(401).json(new ApiResponse(401, {}, "Invalid refresh token"));
        }

        const { accessToken, refreshToken } = await generateAccesAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true
        };

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, {
                accessToken,
                refreshToken
            }, "Access token refreshed"));
    } catch (error) {

        return res.status(500).json(new ApiResponse(500, {}, "Error refreshing access token"));
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const id = req.user?._id;
        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json(new ApiResponse(400, {}, "User not authenticated"));
        }

        const isPasswordValid = await user.isPasswordCorrect(oldPassword);
        if (!isPasswordValid) {
            return res.status(400).json(new ApiResponse(400, {}, "Invalid old password"));
        }

        user.password = newPassword;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, {}, "Error changing password"));
    }
});

const getCurrentUser = asyncHandler(async (req, res) => {
    try {
        return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, {}, "Error fetching current user"));
    }
});

const updateDetails = asyncHandler(async (req, res) => {
    try {
        const { fullName, email } = req.body;
        if (!fullName && !email) {
            return res.status(400).json(new ApiResponse(400, {}, "No field to update"));
        }

        let user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    fullName: fullName ? fullName : req.user.fullName,
                    email: email ? email : req.user.email
                }
            },
            { new: true }
        );

        user = await User.findById(req.user?._id).select("-password");

        return res.status(200).json(new ApiResponse(200, { user }, "Details updated successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, {}, "Error updating details"));
    }
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateDetails
};
