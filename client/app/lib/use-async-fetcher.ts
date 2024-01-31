import { useFetcher, type SubmitOptions } from "@remix-run/react";
import { type SubmitTarget } from "react-router-dom/dist/dom";
import React from "react";

type PromiseFn = (value: unknown) => void;

function useAsyncFetcher() {
	const promise = React.useRef<[PromiseFn, PromiseFn]>();
	const fetcher = useFetcher();

	const submit = React.useCallback(
		(target: SubmitTarget, options: SubmitOptions) => {
			let p = new Promise((resolve, reject) => {
				promise.current = [resolve, reject];
				fetcher.submit(target, options);
			});

			return p;
		},
		[fetcher],
	);

	React.useEffect(() => {
		if (!promise.current) return;
		const [resolve] = promise.current;

		if (fetcher.data) {
			resolve(fetcher.data);
		}
	}, [fetcher.data]);

	return { submit };
}

export { useAsyncFetcher };
