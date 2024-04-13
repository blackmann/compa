import { User } from "@prisma/client";
import React from "react";
import { Jsonify } from 'type-fest'

const GlobalCtx = React.createContext({
	user: null as User | Jsonify<User> | null | undefined,
	unreadNotifications: 0,
});

function useGlobalCtx() {
	return React.useContext(GlobalCtx);
}

export { GlobalCtx, useGlobalCtx };
