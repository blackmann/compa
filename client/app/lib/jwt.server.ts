import jwt from "jsonwebtoken";

function signUser(user: { id: number }): string {
	return jwt.sign({ sub: user.id }, process.env.SECRET_KEY as string);
}

function decodeToken(token: string): jwt.JwtPayload | null {
	try {
		return jwt.verify(
			token,
			process.env.SECRET_KEY as string,
		) as jwt.JwtPayload;
	} catch (err) {
		return null;
	}
}

export { decodeToken, signUser };
