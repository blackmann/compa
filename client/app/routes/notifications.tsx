import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";
import { checkAuth } from "~/lib/check-auth";
import { prisma } from "~/lib/prisma.server";
import { values } from "~/lib/values.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userId = await checkAuth(request);
	const notifications = await prisma.notificationSuscribers.findMany({
		where: { userId, read: false },
		include: { notification: true, user: true },
	});

	return json({ school: values.meta(), notifications });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `Notifications | ${data?.school.shortName} ✽ compa` },
		{
			name: "notifications",
			content: "Find out about all your unread notifications",
		},
	];
};

export default function Notifications() {
	const { notifications } = useLoaderData<typeof loader>();

	return (
		<div className="container mx-auto min-h-[60vh]">
			{notifications.map((notification) => {
				switch (notification.notification.entityType) {
					case "post":
						return (
							<NavLink
								key={notification.id}
								className="block"
								to={`/discussions/${notification.notification.entityId}`}
							>{`${notification.user.username} posted on a discussion`}</NavLink>
						);
				}
			})}
		</div>
	);
}
