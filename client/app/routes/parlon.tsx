import { json, type MetaFunction } from "@remix-run/node";
import { values } from "~/lib/values.server";

export const loader = async () => {
	return json({ school: values.meta() });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `Parlon | ${data?.school.shortName} | compa` },
		{
			name: "description",
			content:
				"Make friends, find love, learn from random people on campus",
		},
	];
};

export default function Parlon() {
	return (
		<div className="container min-h-[60vh]">
			<header className="text-center mb-4">
				<h1>Parlon</h1>
				<p className="text-secondary leading-tight">
					Make friends, find love, learn from random people on campus
				</p>
			</header>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="grid-cols-1">
					<div className="rounded-lg bg-zinc-200 aspect-[5/4] dark:bg-neutral-800 flex flex-col justify-between">
						<header className="justify-between flex items-start p-2">
							<div>
								<div className="font-mono">@mufasa</div>
							</div>
							<div>
								<span className="text-secondary">Reveal in</span>{" "}
								<span className="font-mono">10</span>
							</div>
						</header>
						<footer className="flex justify-end p-2">
							<button
								type="button"
								className="px-2 py-1 rounded-full bg-red-500 flex items-center gap-2 font-medium"
							>
								<div className="i-lucide-phone-off" /> Hang up
							</button>
						</footer>
					</div>
				</div>

				<div className="grid-cols-1">
					<div className="rounded-lg bg-zinc-200 aspect-[5/4] dark:bg-neutral-800">
						<header className="justify-between flex items-start p-2">
							<div>
								<div className="font-mono">
									@notgr<span className="text-secondary">&bull;you</span>
								</div>
								<p className="text-sm text-secondary">You're muted</p>
							</div>

							<div className="flex gap-2 items-center">
								<button
									className="flex gap-2 items-center rounded-full px-2 py-1 bg-neutral-700"
									type="button"
								>
									<div>🙈</div> Shy mode off
								</button>

								<button
									className="aspect-square rounded-full p-2 bg-blue-500 text-xl"
									type="button"
								>
									<div className="i-lucide-mic" />
								</button>
							</div>
						</header>
					</div>
					<div className="mx-2 text-sm text-secondary leading-tight mt-1">
						Enabling Shy mode will hide your video from the other person for 10
						seconds when connected. You can use the voice channel to introduce
						yourselves before you're revealed.
					</div>
				</div>
			</div>
		</div>
	);
}
