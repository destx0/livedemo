import { NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

const API_KEY = process.env.LIVEKIT_API_KEY!;
const API_SECRET = process.env.LIVEKIT_API_SECRET!;

export async function GET(request: Request) {
	try {
		// Get room name from query params
		const { searchParams } = new URL(request.url);
		const roomName = searchParams.get('room');

		if (!roomName) {
			return NextResponse.json(
				{ error: 'Room name is required' },
				{ status: 400 }
			);
		}

		// Generate a random identity for this participant
		const identity = `user-${Math.random().toString(36).slice(2, 7)}`;

		// Create access token
		const token = new AccessToken(API_KEY, API_SECRET, {
			identity,
			name: identity, // Display name
		});

		// Add grants
		token.addGrant({
			room: roomName,
			roomJoin: true,
			canPublish: true,
			canPublishData: true,
			canSubscribe: true,
		});

		// Return the token
		return NextResponse.json({
			token: token.toJwt(),
			identity,
		});
	} catch (error) {
		console.error('Token generation error:', error);
		return NextResponse.json(
			{ error: 'Failed to generate token' },
			{ status: 500 }
		);
	}
} 