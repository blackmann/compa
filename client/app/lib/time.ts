import dayjs from "dayjs";

function timeFromString(time?: string): number {
	if (!time) return 0;
	const [hour, minute] = time.split(":").map((t) => Number.parseInt(t, 10));
	return (hour * 60 + minute) * 60;
}

function timeToString(time: number): string {
	return dayjs().startOf("day").add(time, "seconds").format("hh:mma");
}

function timeToInputValue(time: number) {
	return dayjs().startOf("day").add(time, "seconds").format("HH:mm:ss");
}

function isBefore(startTime: string, endTime: string): boolean {
	return timeFromString(startTime) < timeFromString(endTime);
}

export { isBefore, timeFromString, timeToInputValue, timeToString };

