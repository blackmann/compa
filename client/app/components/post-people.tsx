import { Prisma } from "@prisma/client";
import { Jsonify } from "type-fest";
import { usePostPeople } from "~/lib/use-post-people";
import { Avatar } from "./avatar";
import { Link } from "@remix-run/react";

type Post = Prisma.PostGetPayload<{ include: { user: true } }>;

interface Props {
	post: Post | Jsonify<Post>;
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
					<Link to={`/p/${person.username}`}>
						<div className="flex gap-2 py-1 px-2 rounded-lg hover:bg-zinc-100 items-center hover-bg-light">
							<Avatar size={22} name={person.username} />

							<div>
								{person.username}{" "}
								{person.id === post.user.id && (
									<span className="bg-zinc-200 dark:bg-neutral-800 rounded-full px-2 text-sm text-secondary font-medium">
										OP
									</span>
								)}
							</div>
						</div>
					</Link>
				))}
			</ul>
		</>
	);
}

export { PostPeople };
