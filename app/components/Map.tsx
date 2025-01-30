"use client"

import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useCallback, useEffect, useRef, useState } from "react"

L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

const LOCATION_TYPES = [
	{ value: "all", label: "All" },
	{ value: "primary", label: "Primary Locations" },
	{ value: "secondary", label: "Secondary Locations" },
]

const DEFAULT_CENTER: [number, number] = [51.505, -0.09]

type Props = {
	searchCenter?: [number, number]
}

export default function Map({ searchCenter }: Props) {
	const mapRef = useRef<L.Map | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const markersRef = useRef<L.Marker[]>([])
	const userMarkerRef = useRef<L.Marker | null>(null)
	const timeoutRef = useRef<NodeJS.Timeout>(null)
	const [locationType, setLocationType] = useState("all")
	const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)

	useEffect(() => {
		if (searchCenter) {
			setCenter(searchCenter)
			return
		}

		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const newCenter: [number, number] = [
						position.coords.latitude,
						position.coords.longitude,
					]
					setCenter(newCenter)
				},
				(error) => {
					console.error("Error getting location:", error)
				}
			)
		}
	}, [searchCenter])

	const handleSearch = useCallback(async () => {
		if (!mapRef.current) return

		const center = mapRef.current.getCenter()
		const response = await fetch(
			`/api/nearby?lat=${center.lat}&lon=${center.lng}${
				locationType !== "all" ? `&type=${locationType}` : ""
			}`
		)
		const landmarks = await response.json()

		landmarks.forEach((landmark: any) => {
			const marker = L.marker([landmark.lat, landmark.lon])
			const popup = L.popup({
				closeButton: true,
				autoPan: true,
			}).setContent(landmark.popup)

			marker.bindPopup(popup)
			marker.on("mouseover", (e) => {
				markersRef.current.forEach((m) => m.closePopup())
				e.target.openPopup()
			})
			marker.addTo(mapRef.current!)
			markersRef.current.push(marker)
		})
	}, [locationType])

	useEffect(() => {
		if (typeof window === "undefined") return

		const setupMap = () => {
			if (!mapRef.current && containerRef.current) {
				mapRef.current = L.map(containerRef.current).setView(center, 13)

				const streetLayer = L.tileLayer(
					"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
					{
						attribution: "© OpenStreetMap contributors",
					}
				)

				const satelliteLayer = L.tileLayer(
					"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
					{
						attribution: "© Esri",
					}
				)

				const baseMaps = {
					"Satellite View": satelliteLayer,
					"Street View": streetLayer,
				}

				satelliteLayer.addTo(mapRef.current)
				L.control.layers(baseMaps).addTo(mapRef.current)

				mapRef.current.on("moveend", () => {
					if (timeoutRef.current) {
						clearTimeout(timeoutRef.current)
					}
					timeoutRef.current = setTimeout(handleSearch, 1000)
				})
			} else if (mapRef.current) {
				mapRef.current.setView(center)
			}
		}

		setupMap()

		const map = mapRef.current
		if (!map) return

		if (userMarkerRef.current) {
			userMarkerRef.current.remove()
		}
		userMarkerRef.current = L.marker(center, {
			title: "Your Location",
			zIndexOffset: 1000,
		})
			.addTo(map)
			.bindPopup("Your Location")
			.openPopup()

		handleSearch()

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
			if (userMarkerRef.current) {
				userMarkerRef.current.remove()
			}
			map.remove()
			mapRef.current = null
		}
	}, [center, handleSearch])

	return (
		<div className="relative h-full w-full">
			<div ref={containerRef} className="h-full w-full" />
			<div className="absolute bottom-4 right-4 bg-white p-2 rounded-md shadow-md flex flex-col gap-2 z-50">
				<div className="flex gap-2">
					<select
						value={locationType}
						onChange={(e) => setLocationType(e.target.value)}
						className="p-2 w-40"
					>
						{LOCATION_TYPES.map((type) => (
							<option key={type.value} value={type.value}>
								{type.label}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	)
}
