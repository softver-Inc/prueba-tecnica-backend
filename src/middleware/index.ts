import { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { Secret } from "jsonwebtoken";
import * as jwt from "jsonwebtoken";

export const SECRET_KEY: Secret = "safa325623egedwey373u45u5u";

//Middlware to verify JWT token
export const verifyToken = (req: Request, res: Response, next: Function) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err: any, decoded: JwtPayload) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.body.userId = decoded.id;
  });
  next();
};