"use client";

import { useMemo, useEffect, useState } from "react";
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
	serverUrl,
	token,
}: {
	serverUrl: string;
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
			serverUrl={serverUrl}
			audio={true}
			video={true}
		>
			<VideoConference chatMessageFormatter={formatChatMessageLinks} />
		</LiveKitRoom>
	);
}

export default function RoomPage({ params }: { params: { roomName: string } }) {
	const [token, setToken] = useState<string>();
	const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL!;

	useEffect(() => {
		const getToken = async () => {
			try {
				const response = await fetch(
					`/api/get-token?room=${params.roomName}`
				);
				const data = await response.json();
				setToken(data.token);
			} catch (error) {
				console.error("Error getting token:", error);
			}
		};

		getToken();
	}, [params.roomName]);

	if (!serverUrl) {
		return <h2>Missing LiveKit URL</h2>;
	}
	if (!token) {
		return (
			<div className="grid h-screen place-items-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
					<p>Connecting to room...</p>
				</div>
			</div>
		);
	}

	return (
		<main data-lk-theme="default" className="h-screen">
			<VideoConferenceComponent serverUrl={serverUrl} token={token} />
		</main>
	);
}
