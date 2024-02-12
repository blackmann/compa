import { Programme } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import React from "react";
import { RequestStatus } from "./request-status";
import { loader as programmesLoader } from "~/routes/programmes";

const cache: Programme[] = [];
function useProgrammes() {
	const [programmes, setProgrammes] = React.useState(cache);
	const fetcher = useFetcher<typeof programmesLoader>();

	const [status, setStatus] = React.useState<RequestStatus>(
		cache.length ? "success" : "loading",
	);

	const refresh = React.useCallback(() => {
		setStatus("loading");
		fetcher.load("/programmes");
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

		setProgrammes(fetcher.data);
		cache.length = 0;
		cache.push(...fetcher.data);

		setStatus("success");
	}, [fetcher]);

	return { programmes, refresh, status };
}

export { useProgrammes };
