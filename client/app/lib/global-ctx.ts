import { User } from "@prisma/client";
import React from "react";

const GlobalCtx = React.createContext({
	user: null as User | null | undefined,
});

function useGlobalCtx() {
	return React.useContext(GlobalCtx);
}

export { GlobalCtx, useGlobalCtx };
