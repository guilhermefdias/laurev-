export const CATEGORIES = {
	brincos: 'Brincos',
	pulseiras: 'Pulseiras',
	colares: 'Colares',
	aneis: 'Anéis'
} as const;

export const FINISHES = {
	prata: 'Prata',
	dourado: 'Dourado'
} as const;

export type ProductCategory = keyof typeof CATEGORIES;
export type ProductFinish = keyof typeof FINISHES;

export interface Product {
	id: string;
	name: string;
	description: string;
	category: ProductCategory;
	finish: ProductFinish;
	/** Preço em reais */
	price: number;
	imageUrl: string | null;
}
