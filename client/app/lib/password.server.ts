import bcrypt from "bcrypt";

const ROUNDS = process.env.NODE_ENV === "production" ? 12 : 4;

async function hash(password: string): Promise<string> {
	return await bcrypt.hash(password, ROUNDS);
}

async function compare(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export { compare, hash };

