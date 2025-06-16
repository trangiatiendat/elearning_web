import { Router, RequestHandler } from "express";
import { login, signup, getMe } from "../controllers/authController";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.post("/login", login);
router.post(
  "/signup",
  (req, res, next) => {
    console.log("Đã nhận request signup", req.body);
    next();
  },
  signup
);

// Route để lấy thông tin user hiện tại
router.get("/me", authenticateToken as RequestHandler, getMe);

export default router;
