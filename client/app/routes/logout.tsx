import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { logout } from "~/lib/logout.server";

export async function action({ request }: ActionFunctionArgs) {
	return await logout(request);
}

export async function loader() {
	return redirect("/discussions");
}
