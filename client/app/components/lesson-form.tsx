import { useLoaderData, useParams, useSubmit } from "@remix-run/react";
import dayjs from "dayjs";
import React from "react";
import { FieldValues, useForm, useFormContext } from "react-hook-form";
import { days } from "~/lib/days";
import { isBefore } from "~/lib/time";
import { useAsyncFetcher } from "~/lib/use-async-fetcher";
import { AddLessonLoader } from "~/routes/timetable_.$year.$programme.$level.$sem.$day.add";
import { Button } from "./button";
import { Input } from "./input";
import { LargeSelect } from "./large-select";

interface Props {
	courses: { id: number; code: string; name: string }[];
	instructors: { id: number; name: string }[];
}

function LessonForm({
	courses: coursesRaw,
	instructors: instructorsRaw,
}: Props) {
	const { level, day } = useParams();
	const { programme } = useLoaderData<AddLessonLoader>();

	const {
		handleSubmit,
		register,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: {
			consent: false,
			courseId: null as number | null,
			timeEnd: dayjs().add(1, "hour").format("HH:mm"),
			instructorId: null as number | null,
			location: "",
			timeStart: dayjs().format("HH:mm"),
			programmeId: programme?.id,
		},
	});

	const [showCourseSelect, setShowCourseSelect] = React.useState(false);
	const [showInstructorSelect, setShowInstructorSelect] = React.useState(false);

	const fetcher = useAsyncFetcher();
	const submit = useSubmit();

	const courses = React.useMemo(
		() =>
			coursesRaw.map(({ code, id, name }) => ({
				label: `${code}: ${name}`,
				value: id,
			})),
		[coursesRaw],
	);

	const instructors = React.useMemo(
		() => instructorsRaw.map(({ id, name }) => ({ label: name, value: id })),
		[instructorsRaw],
	);

	const $instructor = watch("instructorId");
	const $course = watch("courseId");

	const instructor = React.useMemo(
		() => instructors.find((i) => i.value === $instructor),
		[$instructor, instructors],
	);

	const course = React.useMemo(
		() => courses.find((i) => i.value === $course),
		[$course, courses],
	);

	async function handleCourseCreate(data: FieldValues) {
		await fetcher.submit(JSON.stringify(data), {
			action: "/courses",
			encType: "application/json",
			method: "POST",
		});
	}

	async function handleInstructorCreate(data: FieldValues) {
		await fetcher.submit(JSON.stringify(data), {
			action: "/instructors",
			encType: "application/json",
			method: "POST",
		});
	}

	async function addLesson(data: FieldValues) {
		if (!(data.instructorId && data.courseId)) {
			return;
		}

		submit(JSON.stringify(data), {
			action: "..",
			encType: "application/json",
			method: "POST",
		});
	}

	return (
		<form onSubmit={handleSubmit(addLesson)}>
			<header className="font-bold text-lg mb-2">Add Lesson</header>

			<div className="flex gap-2">
				<div className="border border-zinc-200 dark:border-neutral-600 rounded-lg px-2">
					{programme?.name}
				</div>

				<div className="border border-zinc-200 dark:border-neutral-600 rounded-lg px-2">
					L{level}
				</div>

				<div className="border border-zinc-200 dark:border-neutral-600 rounded-lg px-2">
					{days[Number(day)]}s
				</div>
			</div>

			<div className="text-secondary flex gap-2 mt-2">
				<div className="i-lucide-corner-left-up" /> You're adding a lesson
				for the above
			</div>

			<label className="block mt-4">
				<span>Course</span>
				<LargeSelect
					label="Course"
					open={showCourseSelect}
					onToggle={setShowCourseSelect}
					options={courses}
					newForm={<CourseForm />}
					onAdd={handleCourseCreate}
					onSelect={(value) => {
						setValue("courseId", value as number);
						setShowCourseSelect(false);
					}}
				>
					{course?.label ?? "Select a course"}
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
					onAdd={handleInstructorCreate}
					onSelect={(value) => {
						setValue("instructorId", value as number);
						setShowInstructorSelect(false);
					}}
				>
					{instructor?.label ?? "Select an instructor"}
				</LargeSelect>
			</label>

			<div className="grid grid-cols-3 mt-2 gap-2">
				<div className="col-span-1">
					<label className="block">
						<span>Start time</span>
						<Input
							type="time"
							{...register("timeStart", {
								required: true,
							})}
						/>
					</label>
				</div>

				<div className="col-span-1">
					<label className="block">
						<span>End time</span>
						<Input
							type="time"
							{...register("timeEnd", {
								required: true,
								validate: (value) =>
									isBefore(watch("timeStart"), value) ||
									"Should be after start time",
							})}
						/>
					</label>
				</div>

				<div className="col-span-1">
					<label className="block">
						<span>Location</span>
						<Input {...register("location", { required: true })} />
						<small className="text-secondary">Eg. SF24</small>
					</label>
				</div>
			</div>
			{errors.timeEnd && (
				<span className="text-red-500 text-sm">{errors.timeEnd.message}</span>
			)}

			<label className="flex gap-2 mt-2">
				<div>
					<input
						className="!border border-zinc-300 dark:bg-neutral-600 dark:border-neutral-500 rounded-md w-5 h-5"
						type="checkbox"
						{...register("consent", { required: true })}
					/>
				</div>
				<div>
					By clicking <span className="font-medium">Save lesson</span>, you
					agree that these details are correct and conform to the{" "}
					<a className="underline" href="/crowdsourcing#ethics">
						crowdsourcing ethics
					</a>
					.
				</div>
			</label>

			<div className="mt-2">
				<Button>
					<div className="i-lucide-corner-down-left opacity-50" /> Save
					lesson
				</Button>
			</div>
		</form>
	);
}

function CourseForm() {
	const { register } = useFormContext();

	return (
		<div className="p-2">
			<label className="block">
				Code
				<Input {...register("code", { required: true })} />
				<small className="text-secondary">Eg. Math 171</small>
			</label>

			<label className="block mt-2">
				Name
				<Input {...register("name", { required: true })} />
				<small className="text-secondary">Eg. Logic and Set Theory</small>
			</label>
		</div>
	);
}

function InstructorForm() {
	const { register } = useFormContext();

	return (
		<div className="p-2">
			<label className="block">
				Name
				<Input {...register("name", { required: true })} />
			</label>
		</div>
	);
}

export { LessonForm };
