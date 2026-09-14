import {Router} from "express"
import {getMessages} from "../controllers/messagesController";
import {authMiddleware} from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getMessages);
// GET /api/messages - protected, returns all contact messages

export default router;