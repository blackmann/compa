export default function Discussion() {
	return (
		<div className="container mx-auto min-h-[60vh]">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
				<div className="col-span-1"> </div>

				<div className="col-span-1 lg:col-span-2">
					<div className="flex gap-2">
						<div className="flex flex-col items-center">
							<div className="size-8 rounded-full bg-zinc-200 mb-2" />

							<button
								className="i-lucide-triangle text-secondary"
								type="button"
							/>
							<span className="font-medium text-sm">12</span>
							<button
								className="i-lucide-triangle rotate-180 text-secondary"
								type="button"
							/>
						</div>

						<div className="border-b pb-2">
							<header>
								<span className="font-mono text-secondary">
									@notgr &bull; 2mins
								</span>
							</header>

							<div>
								<p>
									Some stuff will be place here about what we want to talk
									about. Thing is that we've been tryingn to get this done for a
									long time now; this is our time.
								</p>

								<p className="mt-2">
									Lorem ipsum dolor sit amet consectetur adipisicing elit.
									Laborum voluptatibus reiciendis earum.
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

					<div className="flex gap-2 mt-4">
						<div className="rounded-full bg-zinc-200 w-10 h-10" />
						<div className="flex-1">
							<textarea
								className="w-full h-10 px-2 py-1 border border-zinc-200 rounded-lg"
								placeholder="Write a comment"
							/>
						</div>
					</div>
				</div>

				<div className="cols-span-1">
					<header className="text-sm text-secondary font-medium ms-1">
						People <span className="bg-zinc-200 rounded-full px-2">12</span>
					</header>

					<ul>
						<li>
							<div className="flex gap-2 p-1 rounded-lg hover:bg-zinc-100 items-center">
								<div className="rounded-full bg-zinc-200 size-6" />
								<div>
									notgr{" "}
									<span className="bg-zinc-200 rounded-full px-2 text-sm text-secondary font-medium">
										OP
									</span>
								</div>
							</div>
						</li>

						<li>
							<div className="flex gap-2 p-1 rounded-lg hover:bg-zinc-100">
								<div className="rounded-full bg-zinc-200 size-6" />
								<div>odumodublvck</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
