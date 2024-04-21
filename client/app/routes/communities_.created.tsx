import { Anchor } from "~/components/anchor";

export default function CommunityCreated() {
	return (
		<div className="container">
			<div>
				Community registration submitted. Please keep an eye on your email
				inbox.
			</div>

			<Anchor to="/">Go home</Anchor>
		</div>
	);
}
