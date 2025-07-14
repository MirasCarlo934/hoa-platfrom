import { Router } from "express";
import visitorInfoHandler from "../handlers/visitor-info";
import generateQrHandler from "../handlers/generate-qr";

export const visitorInfoRoute = '/visitor-info';

const publicRouter = Router();

publicRouter.post('/generate-qr', generateQrHandler);
publicRouter.get(visitorInfoRoute, visitorInfoHandler);

export default publicRouter;