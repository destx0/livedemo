"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RoomData {
	name: string;
	numParticipants: number;
	maxParticipants: number;
	emptyTimeout: number;
	creationTime: string;
}

export default function RoomsPage() {
	const [rooms, setRooms] = useState<RoomData[]>([]);
	const [roomName, setRoomName] = useState("");
	const router = useRouter();

	const fetchRooms = async () => {
		try {
			const response = await fetch("/api/rooms");
			const data = await response.json();
			setRooms(data.rooms);
		} catch (error) {
			console.error("Error fetching rooms:", error);
		}
	};

	const createRoom = async () => {
		try {
			const response = await fetch("/api/rooms", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: roomName,
					emptyTimeout: 600,
					maxParticipants: 20,
				}),
			});
			const data = await response.json();
			console.log("Room created:", data);
			router.push(`/rooms/${roomName}`);
		} catch (error) {
			console.error("Error creating room:", error);
		}
	};

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-md mx-auto space-y-6">
				<div className="flex gap-4">
					<input
						type="text"
						value={roomName}
						onChange={(e) => setRoomName(e.target.value)}
						placeholder="Enter room name"
						className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700"
					/>
					<button
						onClick={createRoom}
						className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
					>
						Create Room
					</button>
				</div>

				<button
					onClick={fetchRooms}
					className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
				>
					Refresh Rooms
				</button>

				<div className="space-y-4">
					{rooms.map((room) => (
						<div
							key={room.name}
							className="p-4 border border-gray-200 dark:border-gray-700 rounded-md"
						>
							<h3 className="font-bold">{room.name}</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
								Participants: {room.numParticipants}
							</p>
							<div className="flex gap-2">
								<button
									onClick={() =>
										router.push(`/rooms/${room.name}`)
									}
									className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
								>
									Join with Video
								</button>
								<button
									onClick={() =>
										router.push(
											`/rooms/${room.name}?view=true`
										)
									}
									className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
								>
									Watch Stream
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
