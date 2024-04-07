import { User } from "@prisma/client";
import React from "react";

const GlobalCtx = React.createContext({
	user: null as User | null | undefined,
	notifications: 0,
});

function useGlobalCtx() {
	return React.useContext(GlobalCtx);
}

export { GlobalCtx, useGlobalCtx };
