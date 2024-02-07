import { useCourses } from "./use-courses";

function useTagCourses() {
	const { courses, status, refresh } = useCourses();

	return {
		status: status === "loading" ? "updating" : "ready",
		items: courses.map((course) => `${course.code}: ${course.name}`),
		update: refresh,
		canAdd: true,
	};
}

export { useTagCourses };
