export type ProductCategory = 'Brincos' | 'Pulseiras' | 'Colares' | 'Aneis';
export type ProductFinish = 'Prata' | 'Dourado';

export interface Product{
    id: string;
    name: string;
    description: string;
    category: ProductCategory;
    finish: ProductFinish;
    price: number;
    imageUrl: string;
}