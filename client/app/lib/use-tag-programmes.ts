import { useProgrammes } from "./use-programmes";

function useTagProgrammes() {
	const { programmes, status, refresh } = useProgrammes();

	return {
		status: status === "loading" ? "updating" : "ready",
		items: programmes.map((prog) => prog.name),
		update: refresh,
		canAdd: true,
	};
}

export { useTagProgrammes };
