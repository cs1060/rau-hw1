import { useState } from "react"

export default function InfoButton() {
	const [showInfo, setShowInfo] = useState(false)

	return (
		<div className="fixed top-4 right-16" style={{ zIndex: 1000 }}>
			<button
				onClick={() => setShowInfo(!showInfo)}
				className="bg-blue-500 text-white w-fit p-2 h-10 rounded-full flex items-center justify-center text-xl animate-wiggle"
			>
				Wtf is this?
			</button>

			{showInfo && (
				<div className="absolute top-14 right-0 bg-white p-4 rounded-md shadow-lg max-w-lg w-96">
					<h3 className="font-bold mb-2">Wikipedia Map Explorer</h3>
					<p className="text-sm">
						Explore Wikipedia landmarks on an interactive map.
						Search for cities, filter by landmark type, and discover
						interesting places around you. Click on markers to read
						Wikipedia extracts and learn more.
					</p>
				</div>
			)}
		</div>
	)
}
