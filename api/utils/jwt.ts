import jwt from "jsonwebtoken";
import "dotenv/config";

const secret = () => {
  const secret2 = process.env["AUTH_SECRET"];
  if (!secret2) throw new Error("AUTH_SECRET não está definido");
  return secret2;
};

export function token(payload: object) {
  return jwt.sign(payload, secret(), { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, secret());
}
