import { Router } from "express";

import { requireJwt } from "../middleware/auth";
import homeHandler from "../handlers/home";
import generateQrHandler from "../handlers/generate-qr";
import visitorInfoHandler from "../handlers/visitor-info";

const indexRouter = Router();

indexRouter.use(requireJwt); // Apply JWT authentication to all routes in this router
indexRouter.get('/', homeHandler);
indexRouter.post('/generate-qr', generateQrHandler);
indexRouter.get('/visitor-info', visitorInfoHandler);

export default indexRouter;