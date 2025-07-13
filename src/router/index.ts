import { Router } from "express";
import { identifyContact } from "../controllers/contact";

const rootRouter = Router();
rootRouter.post("/identify", identifyContact);
export default rootRouter;
