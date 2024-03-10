import { Link, NavLink } from "@remix-run/react";
import clsx from "clsx";
import { useGlobalCtx } from "~/lib/global-ctx";
import { Avatar } from "./avatar";
import { Username } from "./username";

const links = [
	{
		title: "Discussions",
		href: "/discussions",
		icon: "i-lucide-message-circle",
	},
	{
		title: "Timetable",
		href: "/timetable",
		icon: "i-lucide-calendar-range",
	},
	{
		title: "Events",
		href: "/events",
		icon: "i-lucide-sparkle",
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
		<header className="container mx-auto md:border-b border-zinc-200 dark:border-zinc-800 mb-4">
			<div className="rounded-xl my-2">
				<div className="flex justify-between items-center">
					<div>
						<div className="flex gap-4 items-center">
							<a className="block shrink-0" href="/">
								<img src="/sym.svg" width={32} className="inline" alt="Compa" />
							</a>
						</div>
					</div>

					<nav className="max-md:hidden">
						<ul className="flex gap-2">
							{links.map((link) => (
								<li key={link.href}>
									<NavLink
										to={link.href}
										className={({ isActive }) =>
											clsx(
												"px-2 py-1 bg-zinc-200 bg-opacity-50 !hover:bg-opacity-100 dark:bg-opacity-40 dark:bg-neutral-700 rounded-lg font-medium flex items-center gap-2 transition-[background] duration-200",
												{
													"!bg-blue-600 !text-white !bg-opacity-100": isActive,
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

					<div className="font-medium bg-zinc-100 dark:bg-neutral-800 rounded-full p-1 pe-2">
						{user ? (
							<NavLink
								to={`/p/${user.username}`}
								className={({ isActive }) =>
									clsx("flex items-center gap-2 ", {
										"group is-active": isActive,
									})
								}
							>
								<Avatar
									className="border-2 border-transparent group-[.is-active]:border-blue-500 group-[.is-active]:dark:border-amber-500 transition-[border-color] duration-200"
									size={22}
									name={user.username}
								/>{" "}
								<Username user={user} />
							</NavLink>
						) : (
							<Link className="flex gap-2 items-center" to="/login">
								<div className="i-lucide-arrow-right-circle opacity-50" />
								Login
							</Link>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}

function BottomNav() {
	return (
		<div className="fixed left-0 bottom-0 w-full md:hidden">
			<nav className="border-t border-zinc-200 dark:border-neutral-800 bg-zinc-50 dark:bg-zinc-900 static z-10">
				<ul className="flex p-2 justify-around">
					{links.map((link) => (
						<li key={link.href}>
							<NavLink
								to={link.href}
								className={({ isActive }) =>
									clsx(
										"rounded-lg font-medium flex flex-col items-center gap-1 transition-[background] duration-200 group",
										{
											"!bg-opacity-100 is-active": isActive,
										},
									)
								}
							>
								<div className="text-secondary group-[.is-active]:!bg-blue-600 group-[.is-active]:!text-white text-xl px-4 py-1 rounded-full">
									<div className={link.icon} />
								</div>
								<span className="text-xs text-secondary">{link.title}</span>
							</NavLink>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
}

export { BottomNav, Navbar };
