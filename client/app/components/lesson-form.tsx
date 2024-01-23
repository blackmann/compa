import React from "react"
import { LargeSelect } from "./large-select"
import { Input } from "./input"

interface Props {
  courses: { id: number; name: string }[]
  instructors: { id: number; name: string }[]
}

function LessonForm({
  courses: coursesRaw,
  instructors: instructorsRaw,
}: Props) {
  const [showCourseSelect, setShowCourseSelect] = React.useState(false)

  const [showInstructorSelect, setShowInstructorSelect] = React.useState(false)

  const courses = React.useMemo(
    () => coursesRaw.map(({ id, name }) => ({ label: name, value: id })),
    [coursesRaw]
  )

  const instructors = React.useMemo(
    () => instructorsRaw.map(({ id, name }) => ({ label: name, value: id })),
    [instructorsRaw]
  )

  return (
    <form>
      <header className="font-bold text-lg">Add lesson</header>
      {/* <p className="text-secondary">Add new entry for BSc Statics on Mondays</p> */}

      {/* <div className="w-[18rem]">
        <CrowdsourceNotice />
      </div> */}

      <label className="block">
        <span>Course</span>
        <LargeSelect
          label="Course"
          open={showCourseSelect}
          onToggle={setShowCourseSelect}
          options={courses}
          newForm={<CourseForm />}
          onAdd={async () => {}}
          onSelect={() => {}}
        >
          Logic and Set Theory
        </LargeSelect>
      </label>

      <label className="mt-2 block">
        <span>Instructor</span>
        <LargeSelect
          label="Instructor"
          open={showInstructorSelect}
          onToggle={setShowInstructorSelect}
          options={instructors}
          newForm={<InstructorForm />}
          onAdd={async () => {}}
          onSelect={() => {}}
        >
          P. A. Kwabi
        </LargeSelect>
      </label>
    </form>
  )
}

function CourseForm() {
  return (
    <div>


      <div className="p-2">
        <label>
          Name
          <Input name="name" />
        </label>

        <small className="text-secondary">
          Eg. Math 171: Logic and Set Theory
        </small>
      </div>
    </div>
  )
}

function InstructorForm() {
  return <div></div>
}

export { LessonForm }
