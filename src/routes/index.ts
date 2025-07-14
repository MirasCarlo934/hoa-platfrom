import { Router } from "express";
import homeHandler from "../handlers/home";

const indexRouter = Router();

indexRouter.get('/', homeHandler);

export default indexRouter;