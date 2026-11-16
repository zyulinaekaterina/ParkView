export type SpotStatus = 'free' | 'occupied' | 'uncovered'

export type ParkingType = 'bc' | 'jk'

export type Spot = {
  id: string
  label: string
  status: SpotStatus
}

export type Camera = {
  id: string
  name: string
  online: boolean
}

export type Parking = {
  id: string
  name: string
  shortName: string
  address: string
  type: ParkingType
  lat: number
  lng: number
  level: string
  hint: string
  occupancy: { free: number; total: number }
  cameras: Camera[]
  rows: Spot[][]
  entranceLabel: string
  showOnMap: boolean
}
