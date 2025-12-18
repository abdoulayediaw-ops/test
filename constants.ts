
import { AppData } from './types';

export const CROPS = ['Maïs', 'Arachide', 'Anacarde', 'Riz', 'Blé'];
export const REGIONS = ['Dakar', 'Kaolack', 'Tambacounda', 'Saint-Louis', 'Ziguinchor', 'Diourbel', 'Thies'];

export const INITIAL_DATA: AppData = {
  users: [
    { id: '1', name: 'Super Administrateur', login: 'orse', pass: '1234', role: 'ADMIN' },
    { id: '2', name: 'Magasinier Kaolack', login: 'moussa', pass: '1234', role: 'USER' }
  ],
  warehouses: [
    { 
      id: 'w1', 
      name: 'Entrepôt Central Diamniadio', 
      region: 'Dakar', 
      manager: 'Moussa Diop', 
      lat: 14.74, 
      lng: -17.20, 
      stock: { 'Maïs': 5000, 'Riz': 12000 } 
    },
    { 
      id: 'w2', 
      name: 'Base Kaolack Sud', 
      region: 'Kaolack', 
      manager: 'Abdou Fall', 
      lat: 14.15, 
      lng: -16.07, 
      stock: { 'Arachide': 25000, 'Maïs': 8000 } 
    }
  ],
  movements: [
    {
      id: 'm1',
      date: new Date().toISOString(),
      type: 'ENTREE',
      warehouseId: 'w1',
      crop: 'Maïs',
      bags: 100,
      weight: 5000,
      status: 'VALIDATED',
      createdBy: 'Super Administrateur'
    }
  ]
};
