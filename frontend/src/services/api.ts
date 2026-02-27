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
  main_image_url: string | null;
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
        imageUrl: product.main_image_url || product.image_url,
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
      imageUrl: product.main_image_url || product.image_url,
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

// ===== IMÁGENES DE PRODUCTO =====

/**
 * Obtener todas las imágenes de un producto
 * @param {number} productId - ID del producto
 * @returns {Promise<Array>} Lista de imágenes
 */
export const getProductImages = async (
  productId: number,
): Promise<
  { id: number; image_url: string; is_main: boolean; alt_text: string | null }[]
> => {
  try {
    const response = await fetch(`${API_URL}/products/${productId}/images`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.images || [];
  } catch (error) {
    console.error("Error en getProductImages:", error);
    return [];
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

// ===== ADMIN =====

/**
 * Obtener estadísticas del panel de admin (requiere token admin)
 */
export const getAdminStats = async (token: string) => {
  const res = await fetch(`${API_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener estadísticas");
  return res.json();
};

/**
 * Obtener órdenes desde el panel de admin
 */
export const getAdminOrders = async (token: string, page = 1) => {
  const res = await fetch(`${API_URL}/admin/orders?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener órdenes");
  return res.json();
};

/**
 * Actualizar estado de una orden
 */
export const updateOrderStatus = async (
  token: string,
  orderId: number,
  status: string,
) => {
  const res = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Error al actualizar estado");
  return res.json();
};

/**
 * Eliminar un producto (admin)
 */
export const deleteProduct = async (token: string, productId: number) => {
  const res = await fetch(`${API_URL}/admin/products/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
  return res.json();
};
