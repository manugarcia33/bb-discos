// Servicio para comunicarse con el backend API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ===== TIPOS =====

interface ProductFilters {
  category?: string[];
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  onSale?: boolean;
}

interface APIProduct {
  id: number;
  title: string;
  artist: string;
  price: string;
  installments: number;
  installment_price: string;
  category_id: number;
  category_name: string;
  category_slug: string;
  description: string | null;
  year: number | null;
  stock: number;
  image_url: string | null;
  is_featured: boolean;
  is_on_sale: boolean;
  discount_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  title: string;
  artist: string;
  price: number;
  installments: number;
  genre: string;
  category: string;
  stock: number;
  year: number | null;
  imageUrl: string | null;
  isFeatured: boolean;
  isOnSale: boolean;
  discountPercentage: number;
  description?: string | null;
}

// ===== PRODUCTOS =====

/**
 * Obtener todos los productos con filtros opcionales
 * @param {ProductFilters} filters - { category, minPrice, maxPrice, featured, onSale }
 * @returns {Promise<Product[]>} Lista de productos
 */
export const getProducts = async (
  filters: ProductFilters = {},
): Promise<Product[]> => {
  try {
    const params = new URLSearchParams();

    if (filters.category && filters.category.length > 0) {
      // Si hay múltiples categorías, hacer múltiples requests
      // Por ahora, tomamos la primera (luego podemos mejorar esto)
      params.append("category", filters.category[0]);
    }

    if (filters.minPrice && filters.minPrice > 0) {
      params.append("minPrice", String(filters.minPrice));
    }

    if (filters.maxPrice && filters.maxPrice > 0) {
      params.append("maxPrice", String(filters.maxPrice));
    }

    if (filters.featured) {
      params.append("featured", "true");
    }

    if (filters.onSale) {
      params.append("onSale", "true");
    }

    const url = `${API_URL}/products${params.toString() ? "?" + params.toString() : ""}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Error al obtener productos");
    }

    const data = await response.json();

    // Transformar los datos al formato que espera el frontend
    return data.products.map(
      (product: APIProduct): Product => ({
        id: product.id,
        title: product.title,
        artist: product.artist,
        price: parseFloat(product.price),
        installments: Math.round(parseFloat(product.installment_price)),
        genre: product.category_slug,
        category: product.category_name,
        stock: product.stock,
        year: product.year,
        imageUrl: product.image_url,
        isFeatured: product.is_featured,
        isOnSale: product.is_on_sale,
        discountPercentage: product.discount_percentage,
      }),
    );
  } catch (error) {
    console.error("Error en getProducts:", error);
    return [];
  }
};

/**
 * Obtener un producto específico por ID
 * @param {number} id - ID del producto
 * @returns {Promise<Product>} Producto
 */
export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);

    if (!response.ok) {
      throw new Error("Producto no encontrado");
    }

    const data = await response.json();
    const product = data.product;

    return {
      id: product.id,
      title: product.title,
      artist: product.artist,
      price: parseFloat(product.price),
      installments: Math.round(parseFloat(product.installment_price)),
      genre: product.category_slug,
      category: product.category_name,
      stock: product.stock,
      year: product.year,
      imageUrl: product.image_url,
      isFeatured: product.is_featured,
      isOnSale: product.is_on_sale,
      discountPercentage: product.discount_percentage,
      description: product.description,
    };
  } catch (error) {
    console.error("Error en getProductById:", error);
    throw error;
  }
};

// ===== CATEGORÍAS =====

/**
 * Obtener todas las categorías
 * @returns {Promise<Array>} Lista de categorías
 */
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`);

    if (!response.ok) {
      throw new Error("Error al obtener categorías");
    }

    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.error("Error en getCategories:", error);
    return [];
  }
};

/**
 * Obtener una categoría por slug
 * @param {string} slug - Slug de la categoría
 * @returns {Promise<any>} Categoría
 */
export const getCategoryBySlug = async (slug: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/categories/${slug}`);

    if (!response.ok) {
      throw new Error("Categoría no encontrada");
    }

    const data = await response.json();
    return data.category;
  } catch (error) {
    console.error("Error en getCategoryBySlug:", error);
    throw error;
  }
};

// ===== HEALTH CHECK =====

/**
 * Verificar que la API esté funcionando
 * @returns {Promise<boolean>} True si la API responde
 */
export const checkAPIHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error("API no disponible:", error);
    return false;
  }
};
