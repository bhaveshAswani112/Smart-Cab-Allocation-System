import { Router } from "express";
import {registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateDetails
} from "../controllers/userController.js"
import { verifyJWT } from "../middlewares/auth.js";

const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

// secure routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-details").patch(verifyJWT,updateDetails)







export default router