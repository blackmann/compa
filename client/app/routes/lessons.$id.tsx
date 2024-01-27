import { ActionFunctionArgs } from "@remix-run/node"
import { prisma } from "~/lib/prisma.server"
import { timeFromString } from "~/lib/time"

export const action = async ({ request, params }: ActionFunctionArgs) => {
  if (!["PATCH", "DELETE"].includes(request.method)) {
    return new Response(null, {
      status: 405,
      statusText: "Method Not Allowed",
    })
  }

  if (request.method === "DELETE") {
    await prisma.schedule.delete({ where: { id: Number(params.id) } })

    return null
  }

  const body = await request.json()

  const updated = await prisma.schedule.update({
    where: { id: Number(params.id) },
    data: {
      ...body,
      timeStart: timeFromString(body.timeStart),
      timeEnd: timeFromString(body.timeEnd),
    },
  })

  return { updated }
}
