import jwt from "jsonwebtoken";

import { Role } from "../generated/prisma/enums.js";
const jwtSecret = process.env.JWT_ACCESS_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

export const generateToken = (userId: string, role: Role) => {
  if (!jwtSecret || !jwtRefreshSecret) {
    throw jwt.JsonWebTokenError;
  }
  const accessToken = jwt.sign({ userId, role }, jwtSecret, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId, role }, jwtRefreshSecret, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};
