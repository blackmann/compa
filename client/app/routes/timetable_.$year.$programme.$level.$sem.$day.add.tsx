import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { LessonForm } from "~/components/lesson-form"
import { prisma } from "~/lib/prisma.server"

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const courses = await prisma.course.findMany({ orderBy: { code: "asc" } })
  const instructors = await prisma.instructor.findMany({
    orderBy: { name: "asc" },
  })

  const programme = await prisma.programme.findFirst({
    where: { slug: params.programme },
  })

  return { courses, instructors, programme }
}

export default function AddLesson() {
  const { courses, instructors } = useLoaderData<typeof loader>()
  return <LessonForm courses={courses} instructors={instructors} />
}

export type AddLessonLoader = typeof loader
