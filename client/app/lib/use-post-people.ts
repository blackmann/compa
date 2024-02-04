import { User } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import React from "react";

function usePostPeople(postId: number) {
	const [people, setPeople] = React.useState<User[]>([]);
	const fetcher = useFetcher();

	React.useEffect(() => {
		fetcher.load(`/people?postId=${postId}`);
	}, [postId, fetcher.load]);

	React.useEffect(() => {
		if (fetcher.data) {
			setPeople(fetcher.data.people);
		}
	}, [fetcher.data]);

	return people;
}

export { usePostPeople };
