import React from "react";

function useMounted() {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);

		return () => {
			setMounted(false);
		};
	}, []);

	return mounted;
}

export { useMounted }
