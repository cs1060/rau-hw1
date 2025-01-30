import axios from "axios"
import { NextResponse } from "next/server"

const HEADERS = { "User-Agent": "LandmarkFinder/1.0" }
const processedLandmarks = new Set<string>()

async function getWikiDetails(title: string) {
	try {
		const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`
		const { data } = await axios.get(url, { headers: HEADERS })
		const details = {
			url: data.content_urls?.desktop?.page || "",
			image: data.thumbnail?.source || "",
			extract: data.extract || "",
		}
		return details
	} catch (error) {
		return { url: "", image: "", extract: "" }
	}
}

async function getLandmarksNearby(lat: number, lon: number, type?: string) {
	try {
		const radius = 10000
		const limit = 50
		let url = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lon}&gsradius=${radius}&gslimit=${limit}&format=json&gsprop=type`

		const { data } = await axios.get(url, { headers: HEADERS })

		let landmarks = data.query.geosearch
		console.log("url", url)

		if (type && type !== "all") {
			landmarks = landmarks.filter(
				(landmark: any) => landmark.type === type
			)
		}

		return landmarks
	} catch (error) {
		console.error("Error fetching landmarks:", error)
		return []
	}
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const lat = searchParams.get("lat")
	const lon = searchParams.get("lon")
	const type = searchParams.get("type")

	if (!lat || !lon) {
		return NextResponse.json(
			{ error: "Missing coordinates" },
			{ status: 400 }
		)
	}

	const landmarks = await getLandmarksNearby(
		Number(lat),
		Number(lon),
		type || undefined
	)
	const landmarksWithDetails = await Promise.all(
		landmarks.map(async (landmark: any) => {
			const details = await getWikiDetails(
				landmark.title.replace(/\s+/g, "_")
			)
			if (!details.url) return null
			if (processedLandmarks.has(`${landmark.lat},${landmark.lon}`))
				return null

			const key = `${landmark.lat},${landmark.lon}`
			processedLandmarks.add(key)

			return {
				lat: landmark.lat,
				lon: landmark.lon,
				type: landmark.type === null ? "all" : landmark.type,
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

	return NextResponse.json(landmarksWithDetails.filter(Boolean))
}
