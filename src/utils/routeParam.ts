import type { Request } from "express";

export function routeParam(req: Request, name: string) {
  const value = req.params[name];
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value[0]) return value[0];
  return "";
}
