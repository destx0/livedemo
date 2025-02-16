import { NextResponse } from "next/server";

const EXTERNAL_API_URL = "http://94.136.189.162:3000";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const roomName = searchParams.get("room");

		if (!roomName) {
			return NextResponse.json(
				{ error: "Room name is required" },
				{ status: 400 }
			);
		}

		// Generate a random user ID
		const userId = `user_${Math.random().toString(36).slice(2, 7)}`;

		// Forward request to external API
		const response = await fetch(
			`${EXTERNAL_API_URL}/getToken?user=${userId}&room=${roomName}`
		);
		const data = await response.json();

		return NextResponse.json(data);
	} catch (error) {
		console.error("Token generation error:", error);
		return NextResponse.json(
			{ error: "Failed to generate token" },
			{ status: 500 }
		);
	}
}
