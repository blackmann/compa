import { Button } from "~/components/button";
import { Input } from "~/components/input";

export default function ForgotPassword() {
	return (
		<div className="container mx-auto">
			<div className="min-h-[60vh]">
				<div className="lg:max-w-[24rem] mx-auto">
					<form className="bg-white dark:bg-neutral-900 rounded-lg border dark:border-neutral-800 p-4 z-10 relative">
						<h1 className="font-bold text-2xl mb-2">
							Reset Account <br />
							Password
						</h1>

						<label className="block mt-2">
							Email
							<Input name="email" />
							<small className="text-secondary">
								A reset link will be sent to this address if it's valid.
							</small>
						</label>

						<div className="mt-2">
							<Button>Send link</Button>
						</div>
					</form>
					<span className="bg-zinc-200 dark:bg-neutral-800 ms-4 px-2 pt-2 font-medium rounded-b-md -mt-2">
						KNUST
					</span>
				</div>
			</div>
		</div>
	);
}
