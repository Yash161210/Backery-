export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency?: string;
  flavor?: string;
  category?: string;
  weightOptions?: string[];
  imageUrl?: string;
  isFeatured?: boolean;
  isPopular?: boolean;
};

export type GalleryImage = {
  _id: string;
  title?: string;
  category?: string;
  imageUrl: string;
};

export type Order = {
  _id: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    flavor?: string;
    weight?: string;
    imageUrl?: string;
  }>;
  subtotal: number;
  customer: { name: string; phone: string; email?: string; address?: string; notes?: string };
  status: string;
  createdAt: string;
};

