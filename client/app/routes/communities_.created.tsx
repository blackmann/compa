import { Anchor } from "~/components/anchor";

export default function CommunityCreated() {
	return (
		<div className="container mx-auto min-h-[60vh]">
			<h1 className="font-bold text-lg">Community registration submitted.</h1>
			<div className="mb-2 text-secondary">
				This will go through a short review process. Please keep an eye on your
				notifications for update.
			</div>

			<Anchor to="/">Go home</Anchor>
		</div>
	);
}
