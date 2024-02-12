import { NavLink } from "@remix-run/react";
import clsx from "clsx";

const links = [
	{
		title: "Discussions",
		href: "/discussions",
		icon: "i-lucide-message-square-quote",
	},
	{
		title: "Timetable",
		href: "/timetable",
		icon: "i-lucide-calendar-range",
	},
];

function Navbar() {
	return (
		<header className="py-2 container mx-auto bg-zinc-100 dark:bg-neutral-800 lg:rounded-xl lg:mt-2 mb-5 max-lg:rounded-b-lg max-md:rounded-b-0">
			<div className="grid grid-cols-3 gap-4">
				<div className="col-span-2">
					<div className="flex gap-4 items-center">
						<a className="block shrink-0" href="/">
							<img src="/sym.svg" width={32} className="inline" alt="Compa" />
						</a>

						<nav>
							<ul className="flex gap-2">
								{links.map((link) => (
									<li key={link.href}>
										<NavLink
											to={link.href}
											className={({ isActive }) =>
												clsx(
													"px-2 py-1 bg-zinc-200 bg-opacity-50 !hover:bg-opacity-100 dark:bg-opacity-40 dark:bg-neutral-700 rounded-lg font-medium flex items-center gap-2 transition-[background] duration-200",
													{
														"!bg-blue-600 !text-white !bg-opacity-100":
															isActive,
													},
												)
											}
										>
											<div className={clsx("opacity-70", link.icon)} />{" "}
											{link.title}
										</NavLink>
									</li>
								))}
							</ul>
						</nav>
					</div>
				</div>
			</div>
		</header>
	);
}

export { Navbar };
