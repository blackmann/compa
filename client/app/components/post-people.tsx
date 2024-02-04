import { Prisma } from "@prisma/client";
import { usePostPeople } from "~/lib/use-post-people";

interface Props {
	post: Prisma.PostGetPayload<{ include: { user: true } }>;
}

function PostPeople({ post }: Props) {
	const people = usePostPeople(post.id);

	return (
		<>
			<header className="text-sm text-secondary font-medium ms-1 flex items-center gap-2">
				<div className="i-lucide-users-2" /> People
				<span className="bg-zinc-200 dark:bg-neutral-800 rounded-full px-2">
					{post.people}
				</span>
			</header>

			<ul>
				{people.map((person) => (
					<li key={person.id}>
						<div className="flex gap-2 py-1 px-2 rounded-lg hover:bg-zinc-100 items-center hover-bg-light">
							<div className="rounded-full bg-zinc-200 dark:bg-neutral-700 size-6" />
							<div>
								{person.username}{" "}
								{person.id === post.user.id && (
									<span className="bg-zinc-200 dark:bg-neutral-800 rounded-full px-2 text-sm text-secondary font-medium">
										OP
									</span>
								)}
							</div>
						</div>
					</li>
				))}
			</ul>
		</>
	);
}

export { PostPeople };
