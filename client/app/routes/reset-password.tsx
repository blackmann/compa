import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
	return [{ title: "Reset Password | compa" }];
};

export default function ResetPassword() {
	return <div className="container">Reset password</div>;
}
