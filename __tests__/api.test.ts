import { GET as getLocation } from "@/app/api/location/route"
import { GET as getNearby } from "@/app/api/nearby/route"

describe("API Endpoints", () => {
	it("nearby API returns landmarks", async () => {
		const request = new Request(
			"http://localhost:3000/api/nearby?lat=51.5&lon=-0.09&type=all"
		)
		const response = await getNearby(request)
		const data = await response.json()

		expect(response.status).toBe(200)
		expect(Array.isArray(data)).toBe(true)
		expect(data.length).toBeGreaterThan(0)
		expect(data[0]).toHaveProperty("lat")
		expect(data[0]).toHaveProperty("lon")
		expect(data[0]).toHaveProperty("popup")
	})

	it("location API returns coordinates", async () => {
		const request = new Request(
			"http://localhost:3000/api/location?city=London"
		)
		const response = await getLocation(request)
		const data = await response.json()

		expect(response.status).toBe(200)
		expect(data).toHaveProperty("lat")
		expect(data).toHaveProperty("lon")
		expect(typeof data.lat).toBe("number")
		expect(typeof data.lon).toBe("number")
	})

	it("location API handles invalid city", async () => {
		const request = new Request(
			"http://localhost:3000/api/location?city=ThisCityDoesNotExist123"
		)
		const response = await getLocation(request)

		expect(response.status).toBe(404)
	})

	it("nearby API handles invalid coordinates", async () => {
		const request = new Request("http://localhost:3000/api/nearby")
		const response = await getNearby(request)

		expect(response.status).toBe(400)
	})
})
