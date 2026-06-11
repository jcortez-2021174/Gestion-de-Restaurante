import { Router } from "express";

import { getStats, getReports } from "./dashboard.controller.js";
import { validateJWT } from "../../middlewares/validate-jwt.js";
import { authorizeRole } from "../../middlewares/authorize-role.js";

const router = Router();

router.get("/stats", validateJWT, authorizeRole("ADMIN_ROLE"), getStats);
router.get("/reports", validateJWT, authorizeRole("ADMIN_ROLE"), getReports);

export default router;
