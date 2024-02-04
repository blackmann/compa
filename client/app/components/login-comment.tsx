import { Link } from "@remix-run/react";

function LoginComment() {
	return (
		<div className="p-2">
			<p className="text-secondary">
				You must be{" "}
				<Link className="underline text-reset" to="/login">
					logged in
				</Link>{" "}
				to comment.
			</p>
		</div>
	);
}

export { LoginComment }
