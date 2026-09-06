import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.createHash("sha256").update("dreamcode-botwa-encryption-key").digest();
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(text: string): string {
  const [ivHex, tagHex, dataHex] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const encrypted = Buffer.from(dataHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}

export function maskSensitive(value: string): string {
  if (!value) return value;
  if (value.length <= 4) return "*".repeat(value.length);
  return `${value.slice(0, 2)}****${value.slice(-2)}`;
}
