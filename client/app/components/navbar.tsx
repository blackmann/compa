import {
	Form,
	Link,
	NavLink,
	useLocation,
	useRouteLoaderData,
} from "@remix-run/react";
import clsx from "clsx";
import React from "react";
import type { loader } from "~/root";
import { Avatar } from "./avatar";
import { Username } from "./username";
import { Dialog } from "./dialog";
import { Button } from "./button";

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
		title: "Library",
		href: "/library",
		icon: "i-lucide-library-square",
	},
	{
		title: "Events",
		href: "/events",
		icon: "i-lucide-sparkle",
	},
	{
		title: "Communities",
		href: "/communities",
		icon: "i-lucide-users-round",
	},
	{
		title: "Marketplace",
		href: "/market",
		icon: "i-lucide-shopping-bag",
	},
	{
		title: "Parlon",
		href: "/parlon",
		icon: "i-lucide-video text-pink-500",
	},
	{
		title: "Games",
		href: "/games",
		icon: "i-lucide-gamepad-2",
	},
];

function Navbar() {
	const { user, unreadNotifications } =
		useRouteLoaderData<typeof loader>("root") || {};

	return (
		<header className="container mx-auto border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-zinc-50 dark:bg-neutral-900 z-10">
			<div className="rounded-xl py-2">
				<div className="flex justify-between items-center">
					<div>
						<div className="flex gap-4 items-center">
							<Link className="block shrink-0" to="/">
								<img src="/sym.svg" width={32} className="inline" alt="Compa" />
							</Link>
						</div>
					</div>

					<div className="flex gap-2 items-center">
						{Boolean(user) && (
							<NavLink
								className={({ isActive }) =>
									clsx(
										"size-8 rounded-full border-2 border-transparent bg-zinc-100 hover:bg-zinc-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 flex items-center justify-center relative",
										{ "!bg-blue-600 text-white group is-active": isActive },
									)
								}
								to="/notifications"
							>
								<div className="i-lucide-bell text-xl" />

								{Boolean(unreadNotifications) && (
									<div className="rounded-full absolute -top-1 -right-2 bg-blue-600 text-white font-medium px-1 text-xs !group-[.is-active]:bg-blue-700">
										{unreadNotifications}
									</div>
								)}
							</NavLink>
						)}
						<div className="font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-full p-1 pe-2 transition-[background] duration-200">
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
										className="rounded-full border-2 border-transparent group-[.is-active]:border-blue-600 group-[.is-active]:dark:border-amber-500 transition-[border-color] duration-200"
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
			</div>
		</header>
	);
}

function BottomNav() {
	const { user } = useRouteLoaderData<typeof loader>("root") || {};
	const [showMore, setShowMore] = React.useState(false);
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);
	const location = useLocation();
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		setShowMore(false);
	}, [location.pathname]);

	const handleLogoutClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsDialogOpen(true);
	};

	const handleCancelLogout = () => {
		setIsDialogOpen(false);
	};
	const handleConfirmLogout = () => {
		setIsDialogOpen(false);
	};

	return (
		<div className="fixed left-0 bottom-0 w-full lg:hidden">
			<div
				className={clsx(
					"bg-zinc-50 dark:bg-neutral-900 p-4 border-t dark:border-neutral-700 container mx-auto h-[15rem] overflow-hidden transition-[height] duration-200",
					{
						"!h-0 !py-0 collapsed": !showMore,
						"grid grid-cols-2": Boolean(user),
						"flex justify-end": !user,
					},
				)}
			>
				{Boolean(user) && (
					<>
						<div className="px-2 flex mb-8 items-end py-1  font-medium text-secondary">
							<div
								className="flex items-center gap-4"
								onClick={handleLogoutClick}
							>
								{" "}
								<div className="i-lucide-arrow-left-circle bg-red-500 opacity-70 text-xl" />
								<span className="text-secondary hover:text-dark !dark:hover:text-white">
									Logout
								</span>
							</div>
						</div>

						<Dialog open={isDialogOpen} onClose={handleCancelLogout}>
							<div className="p-4">
								<h2 className="text-base font-semibold flex items-center gap-1">
									Logout
								</h2>
								<p className="mt-2">Are you sure you want to log out?</p>
								<div className="flex justify-end mt-4 gap-2">
									<Button
										className="!text-black px-2 py-1 text-sm bg-gray-200 dark:bg-neutral-800 text-gray-800 !dark:text-white"
										onClick={handleCancelLogout}
									>
										Cancel
									</Button>
									<Form
										action="logout"
										method="post"
										className="transition-[background] duration-200 group cursor-pointer"
									>
										<Button
											onClick={handleConfirmLogout}
											className="text-white text-sm !bg-red-500"
										>
											Continue
										</Button>
									</Form>
								</div>
							</div>
						</Dialog>
					</>
				)}
				<ul className="flex flex-col items-end">
					{links.slice(3).map((link) => (
						<li key={link.href}>
							<NavLink
								className={({ isActive }) =>
									clsx(
										"px-2 py-1 block rounded-lg flex items-center gap-4 hover:bg-zinc-100 dark:hover:bg-neutral-800 group text-secondary",
										{ "!bg-blue-600 !text-white is-active": isActive },
									)
								}
								to={link.href}
							>
								<div>{link.title}</div>
								<div className="text-secondary group-[.is-active]:!bg-blue-600 group-[.is-active]:!text-white text-xl py-1 rounded-full">
									<div className={link.icon} />
								</div>
							</NavLink>
						</li>
					))}
				</ul>
			</div>
			<nav
				className="border-zinc-200 dark:border-neutral-800 bg-zinc-50 dark:bg-zinc-900 static z-10"
				style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
			>
				<ul className="flex p-2 justify-around">
					{links.slice(0, 3).map((link) => (
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
								<div className="text-secondary group-hover:bg-zinc-100 group-hover:dark:bg-neutral-800 group-[.is-active]:!bg-blue-600 group-[.is-active]:!text-white text-xl px-4 py-1 rounded-full">
									<div className={link.icon} />
								</div>
								<span className="text-xs text-secondary">{link.title}</span>
							</NavLink>
						</li>
					))}
					<li>
						<button
							type="button"
							className={clsx("group", { "is-active": showMore })}
							onClick={() => setShowMore(!showMore)}
						>
							<div className="text-secondary group-[.is-active]:!bg-amber-600 group-[.is-active]:!text-white text-xl px-4 py-1 rounded-full">
								<div className="i-lucide-menu" />
							</div>
							<span className="text-xs text-secondary">More</span>
						</button>
					</li>
				</ul>
			</nav>
		</div>
	);
}

function SideNav() {
	const { user } = useRouteLoaderData<typeof loader>("root") || {};
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);

	const handleLogoutClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsDialogOpen(true);
	};

	const handleConfirmLogout = () => {
		setIsDialogOpen(false);
	};

	const handleCancelLogout = () => {
		setIsDialogOpen(false);
	};

	return (
		<div className="flex flex-col h-full justify-between">
			<ul className="flex-grow">
				{links.map((link) => (
					<li key={link.href}>
						<NavLink
							to={link.href}
							className={({ isActive }) =>
								clsx(
									"px-2 py-1 hover:bg-zinc-100 dark:hover:bg-neutral-800 rounded-full font-medium flex items-center gap-2 transition-[background] duration-200",
									{
										"!bg-zinc-200 !dark:bg-neutral-800": isActive,
										"text-secondary": !isActive,
									},
								)
							}
						>
							<div className={clsx("opacity-70", link.icon)} /> {link.title}
						</NavLink>
					</li>
				))}
			</ul>
			{Boolean(user) && (
				<>
					<div
						className="px-2 py-1 hover:bg-zinc-100 dark:hover:bg-neutral-800 rounded-full font-medium flex items-center gap-2 transition-[background] duration-200 group cursor-pointer"
						onClick={handleLogoutClick}
					>
						<div className="i-lucide-arrow-left-circle bg-red-600 opacity-70 " />
						<span className="text-secondary group-hover:text-dark !dark:group-hover:text-white">
							Logout
						</span>
					</div>

					<Dialog open={isDialogOpen} onClose={handleCancelLogout}>
						<div className="p-4">
							<h2 className="text-base font-semibold flex items-center gap-1">
								Logout{" "}
							</h2>
							<p className="mt-2">Are you sure you want to log out?</p>
							<div className="flex justify-end mt-4 gap-2">
								<Button
									className=" !text-black px-2 py-1 text-sm bg-gray-200 dark:bg-neutral-800 text-gray-800 !dark:text-white"
									onClick={handleCancelLogout}
								>
									Cancel
								</Button>
								<Form
									action="logout"
									method="post"
									className=" transition-[background] duration-200 group cursor-pointer"
								>
									<Button
										onClick={handleConfirmLogout}
										className="text-white text-sm !bg-red-500"
									>
										Continue
									</Button>
								</Form>
							</div>
						</div>
					</Dialog>
				</>
			)}
		</div>
	);
}

export { BottomNav, Navbar, SideNav };
