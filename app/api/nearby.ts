import axios from "axios"
import type { NextApiRequest, NextApiResponse } from "next"

const HEADERS = { "User-Agent": "LandmarkFinder/1.0" }

async function getWikiDetails(title: string) {
	try {
		const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`
		const { data } = await axios.get(url, { headers: HEADERS })
		return {
			url: data.content_urls?.desktop?.page || "",
			image: data.thumbnail?.source || "",
			extract: data.extract || "",
		}
	} catch {
		return { url: "", image: "", extract: "" }
	}
}

async function getLandmarksNearby(lat: number, lon: number) {
	try {
		const radius = 10000
		const limit = 10
		const url = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lon}&gsradius=${radius}&gslimit=${limit}&format=json`
		const { data } = await axios.get(url, { headers: HEADERS })
		return data.query.geosearch
	} catch {
		return []
	}
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { lat, lon } = req.query
	if (!lat || !lon) {
		return res.status(400).json({ error: "Missing coordinates" })
	}

	const landmarks = await getLandmarksNearby(Number(lat), Number(lon))
	const landmarksWithDetails = await Promise.all(
		landmarks.map(async (landmark: any) => {
			const details = await getWikiDetails(landmark.title)
			return {
				lat: landmark.lat,
				lon: landmark.lon,
				popup: `
                <div style="width:300px">
                    <h4>${landmark.title}</h4>
                    ${
											details.image
												? `<img src="${details.image}" style="width:100%;max-height:200px;object-fit:cover">`
												: ""
										}
                    <p>${details.extract.slice(0, 200)}...</p>
                    <a href="${
											details.url
										}" target="_blank">Read more on Wikipedia</a>
                </div>
            `,
			}
		})
	)

	res.json(landmarksWithDetails)
}
