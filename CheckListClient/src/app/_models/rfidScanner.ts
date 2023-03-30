export enum Type {
  scales = 'scales',
  case = 'case',
  handHandle = 'handHandle',
}

export enum RFID {
  UHF = 'UHF',
  LHF = 'LHF',
}

export interface rfidScanner {
  name: string,
  typeRFID: Type,
  rfid: RFID,
  baudrate: number,
  ip_address: string,
  created: string,
  edited?: string,
  client: string,
  comment?: string
}

export interface rfidBooking {
  rfidScanner: string,
  user: string,
  created: string,
  edited?: string,
  canceled?: string,
  uploaded?: string,
  date: string,
  tasksList: taskItem[],
  status: string,
  token?: string
}

export interface taskItem {
  experiment: string,
  expId: string,
  rfidTaskType: string,
  totalItemsFromRFID?: number,
  uploadedItemsFromRFID?: number,
  status?: string,
  timestamp?: string
}

export enum TasksTypes {
  day18 = 'day18',
  day21 = 'day21',
  feather2 = 'feather2',
  dna = 'dna',
  comb = 'comb',
  dissection = 'dissection',
  scales = 'scales'
}
