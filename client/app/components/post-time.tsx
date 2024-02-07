import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";

dayjs.extend(relativeTime);

function postTime(time: Date | string) {
	if (dayjs().diff(dayjs(time), "day") < 1) {
		return dayjs(time).fromNow();
	}

	return dayjs(time).format("DD MMM YYYY, HH:mm a");
}

function PostTime({ time }: { time: Date | string }) {
	return (
		<time
			title={dayjs(time).format("DD MMM YYYY, HH:mm a")}
			dateTime={typeof time === "string" ? time : time.toISOString()}
		>
			{postTime(time)}
		</time>
	);
}

export { postTime, PostTime };
