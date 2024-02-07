import { Course } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import React from "react";
import { RequestStatus } from "./request-status";

const cache: Course[] = [];
function useCourses() {
	const [courses, setCourses] = React.useState(cache);
	const fetcher = useFetcher();

	const [status, setStatus] = React.useState<RequestStatus>("loading");

	const refresh = React.useCallback(() => {
		setStatus("loading");
		fetcher.load("/courses");
	}, [fetcher.load]);

	React.useEffect(() => {
		if (cache.length) {
			return;
		}

		refresh();
	}, [refresh]);

	React.useEffect(() => {
		if (!fetcher.data) {
			return;
		}

		setCourses(fetcher.data);
		cache.length = 0;
		cache.push(...fetcher.data);

		setStatus("success");
	}, [fetcher]);

	return { courses, refresh, status };
}

export { useCourses };
