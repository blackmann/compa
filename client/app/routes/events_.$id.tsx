import { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/button";

export const meta: MetaFunction = () => {
	return [{ title: "Event detail | compa" }];
};

export default function EventDetail() {
	return (
		<div className="container mx-auto min-h-[60vh]">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
				<article className="col-span-1 lg:col-span-2 lg:col-start-2">
					<div className="text-xs font-mono mt-2 text-secondary">
						Posted 3 mins ago by @notgr
					</div>
					<h1 className="font-bold text-2xl">Lienda hostel block party</h1>
					<h2 className="text-secondary">
						Students' Biggest Carnival Experience
					</h2>

					<div className="grid grid-cols-1 lg:grid-cols-2 mt-4">
						<div className="col-span-1">
							<div className="flex gap-2 font-medium text-secondary items-center">
								<div className="i-lucide-calendar" />
								Friday, 3rd March
							</div>

							<div className="flex gap-2 font-medium text-secondary items-center">
								<div className="i-lucide-clock" />
								9.00pm — 01.40am
							</div>

							<div className="flex gap-2 font-medium text-secondary items-center">
								<div className="i-lucide-map" />
								Lienda host{" "}
								<a href="/" className="underline text-secondary">
									View on map
								</a>
							</div>
						</div>

						<div className="max-lg:mt-4 lg:text-end flex gap-2 items-start">
							<Button className="shrink-0" variant="neutral">
								<div className="i-lucide-calendar-plus opacity-50" />
								Add to calendar
							</Button>

							<Button className="shrink-0" variant="primary">
								<div className="i-lucide-share opacity-50" />
								Share event
							</Button>
						</div>
					</div>

					<p className="mt-2">
						This is a free ticketed event but you need to register below. Pop-up
						slots available. Text 0247812093 to secure yours now.
					</p>

					<h3 className="mt-2 text-secondary font-medium">Event link</h3>
					<p>
						<a
							className="underline"
							href="https://twitter.com/blackmann/status/89008999"
						>
							https://twitter.com/blackmann/status/89008999
						</a>
					</p>

					<h3 className="text-secondary font-medium mt-4">Poster</h3>
					<div className="grid lg:grid-cols-2">
						<div className="col-span-1">
							<img
								src="https://compa.eu-central-1.linodeobjects.com/20210807-mb_gclass_crazycolors_153_online-scaled-1707145599780_lYFd.jpg"
								alt="img"
								className="rounded-lg"
							/>
						</div>
					</div>
				</article>
			</div>
		</div>
	);
}
