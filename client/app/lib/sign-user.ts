import jwt from "./jwt.server";

function signUser(user: { id: number }): string {
	return jwt.sign({ sub: user.id }, process.env.SECRET_KEY!);
}

export { signUser }
