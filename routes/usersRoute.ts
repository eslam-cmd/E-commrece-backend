import express from "express";
import {
  fetchAuthUsers,
  removeAuthUser,
  updateAuthUser
} from "../controllers/usersController";

const router = express.Router();

router.get("/", fetchAuthUsers); 
router.delete("/:id", removeAuthUser);
router.put('/:id', updateAuthUser);

export default router;
