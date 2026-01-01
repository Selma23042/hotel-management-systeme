export enum RoomType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  SUITE = 'SUITE',
  DELUXE = 'DELUXE'
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  RESERVED = 'RESERVED'
}

export interface Room {
  id: number;
  roomNumber: string;
  roomType: RoomType;
  pricePerNight: number;
  status: RoomStatus;
  floor?: number;
  capacity?: number;
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
  floor?: number;
  capacity?: number;
  description?: string;
  imageUrl?: string;
}