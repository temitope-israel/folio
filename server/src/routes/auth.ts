import {Router} from "express";
import {login} from "../controllers/authController";


const router  = Router();

// POST /api/auth/logn = runs the login controller
router.post("/login", login);


export default router;