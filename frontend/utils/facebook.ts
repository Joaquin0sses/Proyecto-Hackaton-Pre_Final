import { FB_CATALOG_ID, FB_ACCESS_TOKEN } from './config';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    currency: string;
    image_url: string;
}

export async function fetchCatalogProducts(): Promise<Product[]> {
    try {
        // Note: This is a simplified fetch for the hackathon. 
        // In a real app, we would handle pagination and more complex fields.
        const response = await fetch(
            `https://graph.facebook.com/v19.0/${FB_CATALOG_ID}/products?fields=name,description,price,image_url,currency&access_token=${FB_ACCESS_TOKEN}`
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Facebook API Error:", errorData);
            throw new Error(errorData.error?.message || "Failed to fetch products");
        }

        const data = await response.json();

        return data.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price.replace(/[^0-9.]/g, ''), // Extract numeric value
            currency: item.currency,
            image_url: item.image_url
        }));
    } catch (error) {
        console.error("Error fetching catalog:", error);
        throw error;
    }
}

export function getMockProducts(): Product[] {
    return [
        {
            id: '1',
            name: 'PlayStation 5 Console',
            description: 'Next-gen gaming console with 4K graphics.',
            price: '499.99',
            currency: 'USD',
            image_url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: '2',
            name: 'MacBook Pro M3',
            description: 'Supercharged by M3 Pro chip.',
            price: '1999.00',
            currency: 'USD',
            image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: '3',
            name: 'Sony WH-1000XM5',
            description: 'Noise cancelling headphones.',
            price: '348.00',
            currency: 'USD',
            image_url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: '4',
            name: 'Mechanical Keyboard',
            description: 'Custom mechanical keyboard with RGB.',
            price: '120.00',
            currency: 'USD',
            image_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80'
        }
    ];
}
