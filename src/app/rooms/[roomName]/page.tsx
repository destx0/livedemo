"use client";

import { useMemo } from "react";
import {
	LiveKitRoom,
	VideoConference,
	formatChatMessageLinks,
} from "@livekit/components-react";
import {
	Room,
	RoomOptions,
	VideoPresets,
	RoomConnectOptions,
} from "livekit-client";
import "@livekit/components-styles";

function VideoConferenceComponent({
	liveKitUrl,
	token,
}: {
	liveKitUrl: string;
	token: string;
}) {
	const roomOptions = useMemo(
		(): RoomOptions => ({
			publishDefaults: {
				videoSimulcastLayers: [VideoPresets.h540, VideoPresets.h216],
			},
			adaptiveStream: { pixelDensity: "screen" },
			dynacast: true,
		}),
		[]
	);

	const room = useMemo(() => new Room(roomOptions), [roomOptions]);

	const connectOptions = useMemo(
		(): RoomConnectOptions => ({
			autoSubscribe: true,
		}),
		[]
	);

	return (
		<LiveKitRoom
			room={room}
			token={token}
			connectOptions={connectOptions}
			serverUrl={liveKitUrl}
			audio={true}
			video={true}
		>
			<VideoConference chatMessageFormatter={formatChatMessageLinks} />
		</LiveKitRoom>
	);
}

export default function RoomPage({
	searchParams,
}: {
	searchParams: {
		liveKitUrl?: string;
		token?: string;
	};
}) {
	const { liveKitUrl, token } = searchParams;

	if (!liveKitUrl) {
		return <h2>Missing LiveKit URL</h2>;
	}
	if (!token) {
		return <h2>Missing LiveKit token</h2>;
	}

	return (
		<main data-lk-theme="default" className="h-screen">
			<VideoConferenceComponent liveKitUrl={liveKitUrl} token={token} />
		</main>
	);
}
