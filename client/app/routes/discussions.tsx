import { MetaFunction } from "@remix-run/node"
import { values } from "~/lib/values.server"

export const loader = async () => {
  return { school: values.meta() }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Discussions | ${data?.school.shortName} | compa` }]
}

export default function Discussions() {
  return (
    <div className="container min-h-[70vh] mx-auto">
      Discussions: Coming soon
    </div>
  )
}
