import axios from "axios"
import type { NextApiRequest, NextApiResponse } from "next"

const HEADERS = { "User-Agent": "LandmarkFinder/1.0" }

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { city } = req.query
	if (!city) {
		return res.status(400).json({ error: "Missing city name" })
	}

	try {
		const url = `https://nominatim.openstreetmap.org/search?format=json&q=${city}`
		const { data } = await axios.get(url, { headers: HEADERS })
		if (!data.length) {
			return res.status(404).json({ error: "City not found" })
		}
		res.json({
			lat: parseFloat(data[0].lat),
			lon: parseFloat(data[0].lon),
		})
	} catch {
		res.status(500).json({ error: "Failed to get location" })
	}
}
