
export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  login: string;
  pass: string;
  role: Role;
}

export type MovementStatus = 'PENDING' | 'VALIDATED' | 'REJECTED';
export type MovementType = 'ENTREE' | 'SORTIE';

export interface Movement {
  id: string;
  date: string;
  type: MovementType;
  warehouseId: string;
  crop: string;
  bags: number;
  weight: number;
  status: MovementStatus;
  createdBy: string;
}

export interface Warehouse {
  id: string;
  name: string;
  region: string;
  manager: string;
  lat: number;
  lng: number;
  stock: Record<string, number>; // weight in kg per crop
}

export interface AppData {
  users: User[];
  warehouses: Warehouse[];
  movements: Movement[];
}
