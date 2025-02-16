import { NextResponse } from "next/server";

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;

export async function GET(request: Request) {
	try {
		if (!EXTERNAL_API_URL) {
			throw new Error("EXTERNAL_API_URL is not defined");
		}

		const { searchParams } = new URL(request.url);
		const roomName = searchParams.get("room");
		const isViewOnly = searchParams.get("view") === "true";

		if (!roomName) {
			return NextResponse.json(
				{ error: "Room name is required" },
				{ status: 400 }
			);
		}

		// Generate a random user ID with view-only prefix if needed
		const userId = `${isViewOnly ? "viewer_" : "user_"}${Math.random()
			.toString(36)
			.slice(2, 7)}`;

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
