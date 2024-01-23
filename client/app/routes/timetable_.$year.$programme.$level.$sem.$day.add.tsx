import { LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { LessonForm } from "~/components/lesson-form"
import { prisma } from "~/lib/prisma.server"

export const loader = async ({}: LoaderFunctionArgs) => {
  const courses = await prisma.course.findMany({})
  const instructors = await prisma.instructor.findMany({})
  return { courses, instructors }
}

export default function AddLesson() {
  const { courses, instructors } = useLoaderData<typeof loader>()
  return <LessonForm courses={courses} instructors={instructors} />
}
