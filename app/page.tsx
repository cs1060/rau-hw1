"use client"

import axios from "axios"
import dynamic from "next/dynamic"
import { useState } from "react"

const MapComponent = dynamic(() => import("@/app/components/Map"), {
	ssr: false,
	loading: () => <div>Loading map...</div>,
})

export default function Home() {
	const [city, setCity] = useState("")
	const [searchCenter, setSearchCenter] = useState<[number, number] | null>(
		null
	)
	const [error, setError] = useState("")

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			const { data } = await axios.get(
				`/api/location?city=${encodeURIComponent(city)}`
			)
			setSearchCenter([data.lat, data.lon])
			setError("")
		} catch (err) {
			setError("City not found")
		}
	}

	return (
		<div className="h-screen w-screen">
			<form
				onSubmit={handleSearch}
				className="fixed top-4 left-16 flex flex-row gap-2"
				style={{ zIndex: 1000 }}
			>
				<input
					type="text"
					value={city}
					onChange={(e) => setCity(e.target.value)}
					placeholder="Enter city name"
					className="px-4 py-2 rounded-md border border-gray-300"
				/>
				<button
					type="submit"
					className="px-4 bg-blue-500 text-white rounded-md"
				>
					Search
				</button>
				{error && <div className="text-red-500 mt-2">{error}</div>}
			</form>
			<MapComponent searchCenter={searchCenter || undefined} />
		</div>
	)
}
