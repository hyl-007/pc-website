
export interface Part {
  id: string;
  name: string;
  price: number;
  type: 'chassis' | 'cpu' | 'gpu' | 'ram' | 'storage' | 'psu' | 'motherboard' | 'accessory' | 'monitor' | 'keyboard' | 'mouse';
  image: string;
  supplierId: string;
  stock: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'builder' | 'supplier' | 'admin';
  isFirstTime: boolean;
  rating?: number;
  location?: string;
  bio?: string;
}

export interface PCBuild {
  id: string;
  buyerId: string;
  builderId?: string;
  parts: Part[];
  status: 'pending_builder' | 'parts_procurement' | 'assembly' | 'quality_control' | 'delivered';
  totalPrice: number;
  laborFee: number;
}

export interface GalleryItem {
  id: string;
  builderId: string;
  builderName: string;
  image: string;
  specs: string;
  review: string;
}

export interface SupplierOrder {
  id: string;
  builderId: string;
  supplierId: string;
  parts: Part[];
  status: 'ordered' | 'shipped' | 'received';
}
