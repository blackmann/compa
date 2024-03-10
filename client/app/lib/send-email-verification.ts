import { type EmailVerificationRequest } from "@prisma/client";
import { prisma } from "./prisma.server";
import { randomStr } from "./random-str";
import { send } from "./mail.server";

async function sendEmailVerification(email: string) {
	const existingVerification = await prisma.emailVerificationRequest.findFirst({
		where: { email },
	});

	if (!existingVerification) {
		const verification = await prisma.emailVerificationRequest.create({
			data: {
				token: randomStr(48),
				email,
			},
		});

		return await sendEmail(verification);
	}

	// [ ]: Resend email when verification is re-requested. But we should
  // make sure this is not spammed
}

async function sendEmail(verification: EmailVerificationRequest) {
	const subdomain = process.env.SCHOOL;
	const { email, token } = verification;

	const link = [
		`https://${subdomain}.compa.so/verify-email/?`,
		`email=${email}`,
		`&token=${token}`,
	].join("");

	return await send({
		to: verification.email,
		from: "m@compa.so",
		subject: "Account verification ✽ compa",
		text: `Hi and welcome to compa,\n\nClick the following link to verify your account: ${link}.\n\nSee you!\n\n\n(You cannot reply to this email.)`,
	});
}

export { sendEmailVerification };
