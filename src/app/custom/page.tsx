"use client";

import { useMemo } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { Room, RoomOptions, VideoPresets } from "livekit-client";
import "@livekit/components-styles";

const roomOptions: RoomOptions = {
	publishDefaults: {
		videoSimulcastLayers: [VideoPresets.h540, VideoPresets.h216],
	},
	adaptiveStream: { pixelDensity: "screen" },
	dynacast: true,
};

function VideoConferenceComponent({
	liveKitUrl,
	token,
}: {
	liveKitUrl: string;
	token: string;
}) {
	const room = useMemo(() => new Room(roomOptions), []);
	
	return (
		<LiveKitRoom
			room={room}
			token={token}
			serverUrl={liveKitUrl}
			audio={true}
			video={true}
		>
			<VideoConference />
		</LiveKitRoom>
	);
}

export default function CustomPage({
	searchParams,
}: {
	searchParams: { liveKitUrl?: string; token?: string };
}) {
	const { liveKitUrl, token } = searchParams;

	console.log('Received LiveKit URL:', liveKitUrl);
	console.log('Received Token:', token);

	if (!liveKitUrl) {
		return <h2>Missing LiveKit URL</h2>;
	}
	if (!token) {
		return <h2>Missing LiveKit token</h2>;
	}

	return (
		<main
			data-lk-theme="default"
			className="min-h-screen"
		>
			<VideoConferenceComponent
				liveKitUrl={liveKitUrl}
				token={token}
			/>
		</main>
	);
} 