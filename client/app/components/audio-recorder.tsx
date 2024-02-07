import clsx from "clsx";
import React from "react";
import { useAudioRecorder } from "~/lib/use-audio-recorder";

interface Props {
	onRecorded?: (blob: Blob) => void;
	onRecording?: (recording: boolean) => void;
}

function AudioRecorder({ onRecorded, onRecording }: Props) {
	const {
		isPaused,
		isRecording,
		recordingTime,
		startRecording,
		stopRecording,
		togglePauseResume,
		recordingBlob,
		clear,
	} = useAudioRecorder({
		echoCancellation: true,
	});

	React.useEffect(() => {
		if (recordingBlob) {
			onRecorded?.(recordingBlob);
			clear();
		}
	}, [clear, recordingBlob, onRecorded]);

	React.useEffect(() => {
		onRecording?.(isRecording);
	}, [isRecording, onRecording]);

	return (
		<div
			className={clsx(
				"size-8 bg-zinc-200 dark:bg-neutral-800 inline-flex justify-center items-center transition-[width] duration-200 px-2 gap-2",
				{ "w-30 !justify-start !bg-red-500 text-white": isRecording },
			)}
		>
			{isRecording ? (
				<>
					{!isPaused ? (
						<div className="i-svg-spinners-pulse-3 shrink-0" />
					) : (
						<div className="size-2 bg-white rounded-full opacity-50 mx-1 shrink-0" />
					)}
					<div className="font-mono text-sm">
						{secondsToMinuteSeconds(recordingTime)}
					</div>

					<button type="button" onClick={togglePauseResume}>
						<div
							className={clsx("i-lucide-pause dark:opacity-75", {
								"i-lucide-play": isPaused,
							})}
						/>
					</button>

					<button type="button" onClick={stopRecording}>
						<div className="i-lucide-check dark:opacity-75" />
					</button>
				</>
			) : (
				<button
					className="inline-flex"
					onClick={startRecording}
					type="button"
					title="Record audio"
				>
					<span className="i-lucide-mic inline-block" />
				</button>
			)}
		</div>
	);
}

function secondsToMinuteSeconds(seconds: number) {
	const minute = Math.floor(seconds / 60);
	const second = seconds % 60;

	return `${minute}:${second.toString().padStart(2, "0")}`;
}

export { AudioRecorder };
