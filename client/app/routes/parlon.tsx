import { json, type MetaFunction } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import { Anchor } from "~/components/anchor";
import { Button } from "~/components/button";
import { PeerVideoPanel } from "~/components/peer-video-panel";
import { SelfVideoPanel } from "~/components/self-video-panel";
import { ParlonProvider, useParlon } from "~/lib/parlon-context";
import { values } from "~/lib/values.server";
import type { loader as rootLoader } from "~/root";

export const loader = async () => {
	return json({ school: values.meta() });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `Parlon | ${data?.school.shortName} | compa` },
		{
			name: "description",
			content: "Make friends, find love, learn from random people on campus",
		},
	];
};

export default function Parlon() {
	return (
		<ParlonProvider>
			<ParlonContent />
		</ParlonProvider>
	);
}

function ParlonContent() {
	const { selfStream: stream } = useParlon();

	return (
		<div className="container min-h-[60vh]">
			<header className="text-center mb-4">
				<h1>Parlon</h1>
				<p className="text-secondary leading-tight">
					Make friends, find love, learn from random people on campus
				</p>
			</header>

			{stream ? <Panels /> : <GetStarted />}
		</div>
	);
}

function GetStarted() {
	const { requestCamera } = useParlon();
	const { user } = useRouteLoaderData<typeof rootLoader>("root") || {};

	if (!user) {
		return (
			<div className="rounded-lg max-w-[30rem] aspect-[5/4] flex items-center justify-center flex-col mx-auto">
				<div className="text-center">
					<Anchor to="/login" type="button" onClick={requestCamera}>
						<div className="i-lucide-lock" /> Login
					</Anchor>
				</div>

				<p className="text-secondary text-sm text-center mx-8">
					You need to log in or create an account to be able to use Parlon.
					It'll only take a few minutes to create an account if you're new here.
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-lg max-w-[30rem] aspect-[5/4] flex items-center justify-center flex-col mx-auto">
			<div className="text-center">
				<Button type="button" onClick={requestCamera}>
					<div className="i-lucide-camera" /> Enable Camera
				</Button>
			</div>
			<p className="text-secondary text-sm text-center mx-8">
				Your camera is not shown immediately to the other person unless you turn
				off <span className="font-medium">Shy mode</span>
			</p>
		</div>
	);
}

function Panels() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div className="grid-cols-1">
				<PeerVideoPanel />
			</div>

			<div className="grid-cols-1">
				<SelfVideoPanel />

				<div className="mx-2 text-sm text-secondary leading-tight mt-1">
					Enabling Shy mode will hide your video from the other person for 10
					seconds when connected. You can use the voice channel to introduce
					yourselves before you're revealed.
				</div>
			</div>
		</div>
	);
}
