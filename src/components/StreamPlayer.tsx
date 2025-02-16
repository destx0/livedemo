"use client";

import { useTracks } from "@livekit/components-react";
import { Track, TrackPublication } from "livekit-client";
import { useRef, useEffect } from "react";

export function StreamPlayer() {
	const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
	const tracks = useTracks([
		Track.Source.Camera,
		Track.Source.Microphone,
		Track.Source.ScreenShare,
	]);

	useEffect(() => {
		// Attach tracks to video elements
		tracks.forEach((trackReference) => {
			const { publication, participant } = trackReference;
			if (
				publication.kind === Track.Kind.Video &&
				videoRefs.current[participant.identity]
			) {
				const videoElement = videoRefs.current[participant.identity];
				if (videoElement && publication instanceof TrackPublication) {
					publication.track?.attach(videoElement);
				}
			}
		});

		// Cleanup function
		return () => {
			tracks.forEach((trackReference) => {
				const { publication } = trackReference;
				if (publication.kind === Track.Kind.Video) {
					publication.track?.detach();
				}
			});
		};
	}, [tracks]);

	return (
		<div className="relative h-full grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
			{tracks
				.filter(
					(trackReference) =>
						trackReference.publication.kind === Track.Kind.Video
				)
				.map((trackReference) => (
					<div
						key={trackReference.participant.identity}
						className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden"
					>
						<video
							ref={(el) =>
								(videoRefs.current[
									trackReference.participant.identity
								] = el)
							}
							className="w-full h-full object-cover"
							autoPlay
							playsInline
						/>
						<div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
							{trackReference.participant.identity}
						</div>
					</div>
				))}
		</div>
	);
}
