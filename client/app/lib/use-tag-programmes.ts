import { UseData } from "./tag-use-data";
import { useProgrammes } from "./use-programmes";

function useTagProgrammes(): ReturnType<UseData> {
	const { programmes, status, refresh } = useProgrammes();

	return {
		status: status === "loading" ? "loading" : "ready",
		items: programmes.map((prog) => prog.name),
		update: refresh,
		canAdd: true,
	};
}

export { useTagProgrammes };
