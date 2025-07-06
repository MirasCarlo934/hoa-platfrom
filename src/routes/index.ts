import { Router } from "express";

import { requireJwt } from "../middleware/auth";
import homeHandler from "../handlers/home";
import generateQrHandler from "../handlers/generate-qr";
import visitorInfoHandler from "../handlers/visitor-info";

const indexRouter = Router();

indexRouter.get('/', requireJwt, homeHandler);
indexRouter.post('/generate-qr', requireJwt, generateQrHandler);
indexRouter.get('/visitor-info', requireJwt, visitorInfoHandler);

export default indexRouter;