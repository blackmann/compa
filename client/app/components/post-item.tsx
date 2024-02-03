import { Link } from "@remix-run/react";

function PostItem() {
	return (
		<Link to="/discussions/1" className="block">
			<div className="p-2 rounded-lg hover:bg-zinc-100 transition-[background] duration-200 flex gap-2">
				<div className="flex flex-col items-center">
					<div className="size-8 rounded-full bg-zinc-200 mb-2" />

					<button className="i-lucide-triangle text-secondary" type="button" />
					<span className="font-medium text-sm">12</span>
					<button
						className="i-lucide-triangle rotate-180 text-secondary"
						type="button"
					/>
				</div>
				<div>
					<header>
						<span className="font-mono text-secondary">
							@notgr &bull; 2mins
						</span>
					</header>

					<div>
						<p>
							Some stuff will be place here about what we want to talk about.
							Thing is that we've been tryingn to get this done for a long time
							now; this is our time…
						</p>

						<div className="flex mt-2">
							<div className="text-sm flex gap-2 py-1 px-1 rounded-lg border border-zinc-200 bg-white">
								<div>
									<div className="w-8 h-9 bg-rose-500 rounded-md" />
								</div>

								<div>
									<div className="font-mono">logic_assignment.jpg</div>
									<div className="text-secondary leading-none">image</div>
								</div>
							</div>
						</div>
					</div>

					<footer className="mt-2 flex justify-between">
						<span className="inline-flex items-center gap-2 text-secondary">
							<div className="i-lucide-message-circle inline-block" /> 24
						</span>

						<span className="inline-flex items-center gap-2 text-secondary">
							<div className="i-lucide-users-2 inline-block" /> 12 people
						</span>
					</footer>
				</div>
			</div>
		</Link>
	);
}

export { PostItem };
