import { Request, Response, NextFunction } from "express";

interface User {
  id: string;
  role: string;
  email: string;
}

// Extend the Request interface to include the `user` property
declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
};

export default roleMiddleware;
