import { UseData } from "./tag-use-data";
import { useCourses } from "./use-courses";

function useTagCourses(): ReturnType<UseData> {
	const { courses, status, refresh } = useCourses();

	return {
		status: status === "loading" ? "loading" : "ready",
		items: courses.map((course) => `${course.code}: ${course.name}`),
		update: refresh,
		canAdd: true,
	};
}

export { useTagCourses };
