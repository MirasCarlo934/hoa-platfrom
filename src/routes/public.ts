import { Router } from "express";
import visitorInfoHandler from "../handlers/visitor-info";

export const visitorInfoRoute = '/visitor-info';

const publicRouter = Router();

publicRouter.get(visitorInfoRoute, visitorInfoHandler);

export default publicRouter;