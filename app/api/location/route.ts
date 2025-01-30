import { NextResponse } from "next/server"

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const city = searchParams.get("city")

	if (!city) {
		return NextResponse.json(
			{ error: "City parameter is required" },
			{ status: 400 }
		)
	}

	const response = await fetch(
		`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
			city
		)}&format=json&limit=1`
	)

	const data = await response.json()

	if (!data.length) {
		return NextResponse.json({ error: "City not found" }, { status: 404 })
	}

	return NextResponse.json({
		lat: parseFloat(data[0].lat),
		lon: parseFloat(data[0].lon),
	})
}
