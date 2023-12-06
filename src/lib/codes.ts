import { customAlphabet } from "nanoid";

// Ambiguous characters (IO10) removed.
const nanoid = customAlphabet("23456789ABCDEFHJKLMNPQRSTUVWXYZ", 20);

/**
 * Generate code with optional prefix.
 */
export function generateCode({ prefix }: { prefix?: string } = {}) {
  return ((prefix ?? "") + nanoid()).substring(0, 20);
}
