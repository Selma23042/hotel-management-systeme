export interface Room {
  id: number;
  roomNumber: string;
  roomType: RoomType;
  pricePerNight: number;
  status: RoomStatus;
  floor: number;
  capacity: number;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomRequest {
  roomNumber: string;
  roomType: RoomType;
  pricePerNight: number;
  status: RoomStatus;
  floor: number;
  capacity: number;
  description?: string;
  imageUrl?: string;
}

export enum RoomType {
  STANDARD = 'STANDARD',
  DELUXE = 'DELUXE',
  SUITE = 'SUITE'
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE'
}