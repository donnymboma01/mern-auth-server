import express from "express";
import { test } from "../controllers/user.controller.js";

const router = express.Router();

// router.get("/", (req, res) => {
//   res.json({
//     message: "API is responding",
//   });
// });
router.get("/", test);

export default router;
