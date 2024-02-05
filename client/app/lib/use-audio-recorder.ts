import React from "react";

// Modified from: https://github.com/samhirtarif/react-audio-recorder/blob/1c5298cf29aaf9cd6415180a37ee14ca36ccba70/src/hooks/useAudioRecorder.ts

export interface recorderControls {
	startRecording: () => void;
	stopRecording: () => void;
	togglePauseResume: () => void;
	recordingBlob?: Blob;
	isRecording: boolean;
	isPaused: boolean;
	recordingTime: number;
	mediaRecorder?: MediaRecorder;
	clear: () => void;
}

export type MediaAudioTrackConstraints = Pick<
	MediaTrackConstraints,
	| "deviceId"
	| "groupId"
	| "autoGainControl"
	| "channelCount"
	| "echoCancellation"
	| "noiseSuppression"
	| "sampleRate"
	| "sampleSize"
>;

/**
 * @returns Controls for the recording. Details of returned controls are given below
 *
 * @param `audioTrackConstraints`: Takes a {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings#instance_properties_of_audio_tracks subset} of `MediaTrackConstraints` that apply to the audio track
 * @param `onNotAllowedOrFound`: A method that gets called when the getUserMedia promise is rejected. It receives the DOMException as its input.
 *
 * @details `startRecording`: Calling this method would result in the recording to start. Sets `isRecording` to true
 * @details `stopRecording`: This results in a recording in progress being stopped and the resulting audio being present in `recordingBlob`. Sets `isRecording` to false
 * @details `togglePauseResume`: Calling this method would pause the recording if it is currently running or resume if it is paused. Toggles the value `isPaused`
 * @details `recordingBlob`: This is the recording blob that is created after `stopRecording` has been called
 * @details `isRecording`: A boolean value that represents whether a recording is currently in progress
 * @details `isPaused`: A boolean value that represents whether a recording in progress is paused
 * @details `recordingTime`: Number of seconds that the recording has gone on. This is updated every second
 * @details `mediaRecorder`: The current mediaRecorder in use
 */
const useAudioRecorder: (
	audioTrackConstraints?: MediaAudioTrackConstraints,
	onNotAllowedOrFound?: (exception: DOMException) => any,
	mediaRecorderOptions?: MediaRecorderOptions,
) => recorderControls = (
	audioTrackConstraints,
	onNotAllowedOrFound,
	mediaRecorderOptions,
) => {
	const [isRecording, setIsRecording] = React.useState(false);
	const [isPaused, setIsPaused] = React.useState(false);
	const [recordingTime, setRecordingTime] = React.useState(0);
	const [mediaRecorder, setMediaRecorder] = React.useState<MediaRecorder>();
  const timerIntervalRef = React.useRef<ReturnType<typeof setInterval>>();
	const [recordingBlob, setRecordingBlob] = React.useState<Blob>();

	const _startTimer: () => void = React.useCallback(() => {
		timerIntervalRef.current = setInterval(() => {
			setRecordingTime((time) => time + 1);
		}, 1000);
	}, []);

	const _stopTimer: () => void = React.useCallback(() => {
		clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = undefined;
	}, []);

	/**
	 * Calling this method would result in the recording to start. Sets `isRecording` to true
	 */
	const startRecording: () => void = React.useCallback(() => {
		if (timerIntervalRef.current) return;

		navigator.mediaDevices
			.getUserMedia({ audio: audioTrackConstraints ?? true })
			.then((stream) => {
				setIsRecording(true);
				const recorder: MediaRecorder = new MediaRecorder(
					stream,
					mediaRecorderOptions,
				);
				setMediaRecorder(recorder);
				recorder.start();
				_startTimer();

				recorder.addEventListener("dataavailable", (event) => {
					setRecordingBlob(event.data);
          for (const track of stream.getTracks()) {
            track.stop();
          }
					setMediaRecorder(undefined);
				});
			})
			.catch((err: DOMException) => {
				console.log(err.name, err.message, err.cause);
				onNotAllowedOrFound?.(err);
			});
	}, [
    audioTrackConstraints,
		_startTimer,
		onNotAllowedOrFound,
		mediaRecorderOptions,
	]);

	/**
	 * Calling this method results in a recording in progress being stopped and the resulting audio being present in `recordingBlob`. Sets `isRecording` to false
	 */
	const stopRecording: () => void = React.useCallback(() => {
		mediaRecorder?.stop();
		_stopTimer();
		setRecordingTime(0);
		setIsRecording(false);
		setIsPaused(false);
	}, [
		mediaRecorder,
		_stopTimer,
	]);

	/**
	 * Calling this method would pause the recording if it is currently running or resume if it is paused. Toggles the value `isPaused`
	 */
	const togglePauseResume: () => void = React.useCallback(() => {
		if (isPaused) {
			setIsPaused(false);
			mediaRecorder?.resume();
			_startTimer();
		} else {
			setIsPaused(true);
			_stopTimer();
			mediaRecorder?.pause();
		}
	}, [mediaRecorder, isPaused,  _startTimer, _stopTimer]);

	const clear = React.useCallback(() => setRecordingBlob(undefined), []);

	return {
		startRecording,
		stopRecording,
		togglePauseResume,
		recordingBlob,
		isRecording,
		isPaused,
		recordingTime,
		mediaRecorder,
		clear,
	};
};

export { useAudioRecorder };
