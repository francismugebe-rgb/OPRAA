import { Timestamp } from 'firebase/firestore';

export interface Profile {
  id: string;
  name: string;
  age: number;
  gender: string;
  city: string;
  bio: string;
  interests: string[];
  photoUrl?: string;
  status: 'pending' | 'approved';
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  authorId: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface AdminData {
  role: 'admin';
}
