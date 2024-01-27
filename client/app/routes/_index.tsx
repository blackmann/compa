import { redirect, type MetaFunction } from "@remix-run/node"

export const loader = async () => {
  return redirect("/timetable")
}
