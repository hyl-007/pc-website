export interface Part {
  id: string;
  name: string;
  price: number;
  type: 'chassis' | 'cpu' | 'gpu' | 'ram' | 'storage' | 'psu' | 'motherboard';
  image: string;
  specs?: string;
}

export interface PCBuild {
  id: string;
  userId: string;
  parts: Part[];
  totalPrice: number;
  status: 'draft' | 'ordered' | 'building' | 'delivered';
  builderId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'builder' | 'admin';
  isFirstTime: boolean;
  builderApproved?: boolean;
}

export interface GalleryItem {
  id: string;
  user: string;
  image: string;
  specs: string;
  review: string;
  approved: boolean;
}

export interface BuilderJob {
  id: string;
  customerName: string;
  specs: Part[];
  payout: number;
  status: 'pending' | 'accepted' | 'completed';
  location: string;
}
