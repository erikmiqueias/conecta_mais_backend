import { IJwtProvider } from "@shared/providers/jwt/jwt.interface.js";
import jwt from "jsonwebtoken";

export class JwtProvider implements IJwtProvider {
  async sign(
    payload: object,
    secret: string,
    options?: object,
  ): Promise<string> {
    return jwt.sign(payload, secret, options);
  }
}
