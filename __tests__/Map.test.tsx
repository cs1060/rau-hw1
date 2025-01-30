import Map from "@/app/components/Map"
import { fireEvent, render, screen } from "@testing-library/react"
import { act } from "react-dom/test-utils"

jest.mock("leaflet", () => ({
	map: jest.fn(() => ({
		setView: jest.fn(),
		on: jest.fn(),
		remove: jest.fn(),
		getCenter: jest.fn(() => ({ lat: 0, lng: 0 })),
	})),
	tileLayer: jest.fn(() => ({
		addTo: jest.fn(),
	})),
	marker: jest.fn(() => ({
		addTo: jest.fn(),
		bindPopup: jest.fn(),
		on: jest.fn(),
		remove: jest.fn(),
	})),
	popup: jest.fn(() => ({
		setContent: jest.fn(),
	})),
	control: {
		layers: jest.fn(() => ({
			addTo: jest.fn(),
		})),
	},
	Icon: {
		Default: {
			mergeOptions: jest.fn(),
		},
	},
}))

describe("Map Component", () => {
	beforeEach(() => {
		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve([]),
			})
		)
	})

	it("renders map container", () => {
		render(<Map />)
		expect(screen.getByRole("region")).toBeInTheDocument()
	})

	it("changes wiki type when select changes", async () => {
		render(<Map />)
		const select = screen.getByRole("combobox")
		await act(async () => {
			fireEvent.change(select, { target: { value: "landmark" } })
		})
		expect(select).toHaveValue("landmark")
	})

	it("uses provided searchCenter", () => {
		const searchCenter: [number, number] = [51.5, -0.09]
		render(<Map searchCenter={searchCenter} />)
		expect(screen.getByRole("region")).toBeInTheDocument()
	})
})
