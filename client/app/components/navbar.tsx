import { Link, NavLink } from "@remix-run/react";
import clsx from "clsx";
import { useGlobalCtx } from "~/lib/global-ctx";
import { Avatar } from "./avatar";

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
	{
		title: "Resources",
		href: "/resources",
		icon: "i-lucide-folder-search-2",
	},
];

function Navbar() {
	const { user } = useGlobalCtx();

	return (
		<header className="container mx-auto">
			<div className="p-2 bg-zinc-100 dark:bg-neutral-800 rounded-xl mt-2 mb-5 ">
				<div className="flex justify-between items-center">
					<div>
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

					<div>
						{user && (
							<NavLink
								to={`/p/${user.username}`}
								className={({ isActive }) =>
									clsx({ "group is-active": isActive })
								}
							>
								<Avatar
									className="border-2 border-transparent group-[.is-active]:border-blue-500 group-[.is-active]:dark:border-amber-500 transition-[border-color] duration-200"
									size={24}
									name={user.username}
								/>
							</NavLink>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}

export { Navbar };
