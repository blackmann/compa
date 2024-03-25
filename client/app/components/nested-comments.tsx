import { Prisma } from "@prisma/client";
import { useComments } from "~/lib/use-comments";
import { PostItem } from "./post-item";

interface Props {
  post: Prisma.PostGetPayload<{ include: { user: true } }>;
}

function NestedComments({ post }: Props) {
  const { comments, status } = useComments({ postId: post.id });

  if (status === "loading") {
    return (
      <div className="flex gap-2 items-center text-secondary">
        <span className="i-svg-spinners-180-ring-with-bg inline-block" />{" "}
        Loading comments…
      </div>
    );
  }

  return comments.map((comment, i) => (
    <div className="mb-2" key={comment.id}>
      <PostItem post={{ ...comment } as any} level={2} />
      {i < comments.length - 1 && (
        <hr className="me-2 ms-8 dark:border-neutral-800" />
      )}
    </div>
  ));
}

export { NestedComments };
