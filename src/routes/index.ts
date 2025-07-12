import { Router } from "express";
import homeHandler from "../handlers/home";
import generateQrHandler from "../handlers/generate-qr";

const indexRouter = Router();

indexRouter.get('/', homeHandler);
indexRouter.post('/generate-qr', generateQrHandler);

export default indexRouter;