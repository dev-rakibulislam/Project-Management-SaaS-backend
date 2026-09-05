import type{ JwtPayload } from "jsonwebtoken";

export type TJwtPayload = JwtPayload & {
  id: string;
  email: string;
  platformRole: string;
  isActive: boolean;
};

export type TJwtData = {
  secret: string;
  expiresIn: string;
};
