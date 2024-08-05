import { getAllCabs, updateCabLocation, addCab } from '../controllers/cabController.js';
import { Router } from "express";
import { verifyAdmin } from '../middlewares/admin.js';

const router = Router()

router.get('/', getAllCabs);
router.put('/location', updateCabLocation);
router.post('/add-cab',verifyAdmin,addCab);

export default router