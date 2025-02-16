"use client";

import { useState, useCallback } from "react";
import { Room, RoomOptions, VideoPresets } from "livekit-client";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import Link from "next/link";

interface RoomData {
	name: string;
	numParticipants: number;
	maxParticipants: number;
	emptyTimeout: number;
	creationTime: string;
}

export default function Home() {
	return (
		<div className="min-h-screen grid place-items-center">
			<div className="text-center">
				<h1 className="text-4xl font-bold mb-8">
					Welcome to LiveKit Rooms
				</h1>
				<Link
					href="/rooms"
					className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 inline-block"
				>
					View Rooms
				</Link>
			</div>
		</div>
	);
}
