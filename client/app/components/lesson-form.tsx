import React from "react"
import { LargeSelect } from "./large-select"
import { CrowdsourceNotice } from "./crowdsource-notice"

function LessonForm() {
  const [showCourseSelect, setShowCourseSelect] = React.useState(false)

  const [showInstructorSelect, setShowInstructorSelect] = React.useState(false)
  return (
    <form>
      <header className="font-bold text-lg">Add lesson</header>
      {/* <p className="text-secondary">Add new entry for BSc Statics on Mondays</p> */}

      <div className="w-[18rem]">
        <CrowdsourceNotice />
      </div>

      <label className="block">
        <span>Course</span>
        <LargeSelect
          open={showCourseSelect}
          onToggle={setShowCourseSelect}
          options={[]}
        >
          Logic and Set Theory
        </LargeSelect>
      </label>

      <label className="mt-2 block">
        <span>Instructor</span>
        <LargeSelect
          open={showInstructorSelect}
          onToggle={setShowInstructorSelect}
          options={[]}
        >
          P. A. Kwabi
        </LargeSelect>
      </label>
    </form>
  )
}

export { LessonForm }
