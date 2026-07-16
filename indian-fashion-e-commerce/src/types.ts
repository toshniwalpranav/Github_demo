/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: number;
  name: string;
  brand: string;
  gender: 'Men' | 'Women' | 'Kids';
  category: string;
  price: number;
  discount: number;
  discountPrice: number;
  rating: number;
  reviews: number;
  sizes: string[];
  colors: string[];
  stock: number;
  image: string;
  isNew: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  description: string;
  fabric: string;
  fit: string;
  occasion: string;
  delivery: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Review {
  id: number;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  minSpend: number;
}
