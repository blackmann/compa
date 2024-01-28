import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { TimetableFilter } from "~/components/timetable-filter"
import { prisma } from "~/lib/prisma.server"

export const loader = async ({}: LoaderFunctionArgs) => {
  const programmes = await prisma.programme.findMany({
    orderBy: { name: "asc" },
  })

  return { programmes }
}

export const meta: MetaFunction<typeof loader> = () => {
  return [{ title: "Timetable | KNUST | compa" }]
}

export default function Timetable() {
  const { programmes } = useLoaderData<typeof loader>()

  return (
    <div className="container mx-auto min-h-[70vh]">
      <div className="grid grid-cols-1 lg:grid-cols-5">
        <div className="col-span-1 lg:col-start-2 lg:col-span-2">
          <TimetableFilter programmes={programmes} />
        </div>
      </div>
    </div>
  )
}
