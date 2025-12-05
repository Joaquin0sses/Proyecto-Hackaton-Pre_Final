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
