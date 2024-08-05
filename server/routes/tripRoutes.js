import { createTrip } from "../controllers/tripController.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";

const router = Router()

router.post('/',verifyJWT, createTrip);


export default router