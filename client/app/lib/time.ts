function timeFromString(time?: string): number {
	if (!time) return 0;
	const [hour, minute] = time.split(":").map((t) => parseInt(t, 10));
	return (hour * 60 + minute) * 60;
}

function timeToString(time: number): string {
	const hour = Math.floor(time / 3600);
	const minute = Math.floor((time - hour * 3600) / 60);
	return `${pad2(hour)}:${pad2(minute)}`;
}

function pad2(digit: number): string {
	return digit < 10 ? `0${digit}` : `${digit}`;
}

function isBefore(startTime: string, endTime: string): boolean {
	return timeFromString(startTime) < timeFromString(endTime);
}

export { timeFromString, timeToString, isBefore };
