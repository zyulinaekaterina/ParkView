import type { Camera, Parking, Spot, SpotStatus } from '../types'

const F: SpotStatus = 'free'
const O: SpotStatus = 'occupied'
const U: SpotStatus = 'uncovered'

function row(prefix: string, pattern: SpotStatus[]): Spot[] {
  return pattern.map((status, index) => ({
    id: `${prefix}-${index + 1}`,
    label: `${prefix}-${index + 1}`,
    status,
  }))
}

const defaultCameras = (suffix: string): Camera[] => [
  { id: `${suffix}-cam-1`, name: 'CAM-01 Въезд', online: true },
  { id: `${suffix}-cam-2`, name: 'CAM-02 Ряд B', online: true },
  { id: `${suffix}-cam-3`, name: 'CAM-03 Ряд C', online: true },
  { id: `${suffix}-cam-4`, name: 'CAM-04 Выезд', online: false },
]

export const parkings: Parking[] = [
  {
    id: 'alpha',
    name: 'БЦ «Альфа»',
    shortName: 'БЦ «Альфа»',
    address: 'ул. Тверская, 14',
    type: 'bc',
    lat: 55.7652,
    lng: 37.6048,
    level: 'Уровень 1',
    hint: 'Обычно занято в 9:00',
    occupancy: { free: 45, total: 100 },
    cameras: defaultCameras('alpha'),
    entranceLabel: 'ВЪЕЗД 1',
    showOnMap: true,
    rows: [
      row('A', [O, F, O, F, O, O, F, F, O, F, O, F, O, O]),
      row('B', [O, F, F, O, F, F, O, F, O, O, F, O, F, O]),
      row('C', [O, F, O, F, O, F, O, F, O, F, U, U, U, U]),
    ],
  },
  {
    id: 'rechnoy',
    name: 'ЖК «Речной»',
    shortName: 'ЖК «Речной»',
    address: 'Речной пр., 8',
    type: 'jk',
    lat: 55.7638,
    lng: 37.6096,
    level: 'Уровень -1',
    hint: 'Свободно после 19:00',
    occupancy: { free: 3, total: 80 },
    cameras: defaultCameras('rechnoy'),
    entranceLabel: 'ВЪЕЗД А',
    showOnMap: true,
    rows: [
      row('A', [O, O, F, O, O, O, F, O, O, O, F, O, O, O]),
      row('B', [O, O, O, O, O, O, O, O, O, O, O, O, O, O]),
      row('C', [O, O, O, O, O, O, O, O, O, O, U, U, U, U]),
    ],
  },
  {
    id: 'meridian',
    name: 'БЦ «Меридиан»',
    shortName: 'БЦ «Меридиан»',
    address: 'ул. Лесная, 5',
    type: 'bc',
    lat: 55.7616,
    lng: 37.6064,
    level: 'Уровень 1',
    hint: 'Часто есть места днём',
    occupancy: { free: 0, total: 90 },
    cameras: defaultCameras('meridian'),
    entranceLabel: 'ВЪЕЗД 2',
    showOnMap: true,
    rows: [
      row('A', [O, O, O, O, O, O, O, O, O, O, O, O, O, O]),
      row('B', [O, O, O, O, O, O, O, O, O, O, O, O, O, O]),
      row('C', [O, O, O, O, O, O, O, O, O, O, U, U, U, U]),
    ],
  },
  {
    id: 'alpha-2',
    name: 'БЦ «Альфа» 1',
    shortName: 'БЦ «Альфа» 1',
    address: 'ул. Тверская, 14',
    type: 'bc',
    lat: 55.76505,
    lng: 37.6051,
    level: 'Уровень 2',
    hint: 'Пик в 18:00',
    occupancy: { free: 22, total: 100 },
    cameras: defaultCameras('alpha-2'),
    entranceLabel: 'ВЪЕЗД 1',
    showOnMap: false,
    rows: [
      row('A', [F, O, F, O, F, F, O, F, O, F, O, F, O, F]),
      row('B', [O, F, O, F, O, F, O, F, O, F, O, F, O, F]),
      row('C', [F, O, F, O, F, O, F, O, F, O, U, U, U, U]),
    ],
  },
  {
    id: 'rechnoy-2',
    name: 'ЖК «Речной» 2',
    shortName: 'ЖК «Речной» 2',
    address: 'Речной пр., 8',
    type: 'jk',
    lat: 55.76395,
    lng: 37.6091,
    level: 'Уровень -2',
    hint: 'Обычно занято в 8:30',
    occupancy: { free: 18, total: 80 },
    cameras: defaultCameras('rechnoy-2'),
    entranceLabel: 'ВЪЕЗД А',
    showOnMap: false,
    rows: [
      row('A', [O, F, O, F, O, F, O, F, O, F, O, F, O, O]),
      row('B', [F, O, F, O, F, O, F, O, F, O, F, O, F, O]),
      row('C', [O, F, O, F, O, F, O, F, O, F, U, U, U, U]),
    ],
  },
  {
    id: 'meridian-3',
    name: 'БЦ «Меридиан» 3',
    shortName: 'БЦ «Меридиан» 3',
    address: 'ул. Лесная, 5',
    type: 'bc',
    lat: 55.7618,
    lng: 37.6069,
    level: 'Уровень 3',
    hint: 'Стабильно свободно',
    occupancy: { free: 40, total: 90 },
    cameras: defaultCameras('meridian-3'),
    entranceLabel: 'ВЪЕЗД 2',
    showOnMap: false,
    rows: [
      row('A', [F, F, O, F, F, F, O, F, F, O, F, F, F, O]),
      row('B', [F, O, F, F, O, F, F, F, O, F, F, O, F, F]),
      row('C', [F, F, O, F, F, F, O, F, F, F, U, U, U, U]),
    ],
  },
]

export function getParkingById(id: string): Parking | undefined {
  return parkings.find((item) => item.id === id)
}

export const defaultCenter = { lat: 55.7639, lng: 37.6066 }
