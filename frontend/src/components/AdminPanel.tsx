import {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  BarChart2,
  Package,
  Users,
  ShoppingBag,
  Upload,
  PlusCircle,
  X,
  FileText,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ===== TIPOS =====
interface Stats {
  products: { total: number; sin_stock: number };
  categories: number;
  users: { total: number; admins: number };
  orders: {
    total: number;
    ingresos_totales: number;
    ingresos_hoy: number;
    ingresos_mes: number;
  };
  top_products: Array<{
    id: number;
    title: string;
    artist: string;
    unidades_vendidas: number;
  }>;
  recent_orders: Array<{
    id: number;
    status: string;
    total: string;
    created_at: string;
    email?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    guest_email?: string | null;
  }>;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const EMPTY_PRODUCT = {
  title: "",
  artist: "",
  price: "",
  installments: "3",
  installment_price: "",
  label: "",
  country: "",
  condition_cover: "",
  condition_media: "",
  category_id: "",
  stock: "1",
  is_featured: false,
  is_on_sale: false,
  discount_percentage: "0",
  description: "",
};

type TabKey = "stats" | "add-product" | "csv";

// ===== COMPONENTS AUXILIARES =====
function StatCard({
  label,
  value,
  sub,
  variant = "",
}: {
  label: string;
  value: string | number;
  sub?: string;
  variant?: string;
}) {
  return (
    <div className={`admin-stat-card ${variant}`}>
      <div className="admin-stat-label">{label}</div>
      <div className="admin-stat-value">{value}</div>
      {sub && <div className="admin-stat-sub">{sub}</div>}
    </div>
  );
}

function formatMoney(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

// ===== PANEL PRINCIPAL =====
export default function AdminPanel() {
  const { token, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>("stats");

  // Stats
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);

  // Product form
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [productLoading, setProductLoading] = useState(false);
  const [productMessage, setProductMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // CSV
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvMessage, setCsvMessage] = useState<{
    type: "success" | "error";
    text: string;
    errors?: string[];
  } | null>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Redirect si no es admin
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, isLoading, navigate]);

  // Cargar stats
  useEffect(() => {
    if (activeTab === "stats" && token) {
      setStatsLoading(true);
      fetch(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((d) => setStats(d))
        .catch(console.error)
        .finally(() => setStatsLoading(false));
    }
  }, [activeTab, token]);

  // Cargar categorías
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || d))
      .catch(console.error);
  }, []);

  // ===== HANDLERS PRODUCTO =====
  const handleProductChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setProductForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setProductForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...imageFiles, ...files].slice(0, 10);
    setImageFiles(newFiles);
    setImagePreviews(newFiles.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (idx: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== idx);
    setImageFiles(newFiles);
    setImagePreviews(newFiles.map((f) => URL.createObjectURL(f)));
  };

  const handleProductSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProductLoading(true);
    setProductMessage(null);

    try {
      const formData = new FormData();
      Object.entries(productForm).forEach(([k, v]) =>
        formData.append(k, String(v)),
      );
      imageFiles.forEach((f) => formData.append("images", f));

      const res = await fetch(`${API_URL}/admin/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear vinilo");

      setProductMessage({
        type: "success",
        text: `✅ Vinilo "${data.product.title}" creado correctamente (ID: ${data.product.id})`,
      });
      setProductForm(EMPTY_PRODUCT);
      setImageFiles([]);
      setImagePreviews([]);
    } catch (err) {
      setProductMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setProductLoading(false);
    }
  };

  // ===== HANDLERS CSV =====
  const handleCsvSubmit = async () => {
    if (!csvFile) return;
    setCsvLoading(true);
    setCsvMessage(null);

    try {
      const formData = new FormData();
      formData.append("csv", csvFile);

      const res = await fetch(`${API_URL}/admin/products/csv`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al importar CSV");

      setCsvMessage({
        type: "success",
        text: data.message,
        errors: data.errors?.length ? data.errors : undefined,
      });
      setCsvFile(null);
    } catch (err) {
      setCsvMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setCsvLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>Cargando...</div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="admin-panel">
      <h1 className="admin-panel-title">Panel de Administración</h1>
      <p className="admin-panel-subtitle">BB Discos — Gestión de la tienda</p>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          <span style={{ marginRight: "0.4rem" }}>
            <BarChart2 size={15} style={{ verticalAlign: "middle" }} />
          </span>
          Estadísticas
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "add-product" ? "active" : ""}`}
          onClick={() => setActiveTab("add-product")}
        >
          <span style={{ marginRight: "0.4rem" }}>
            <PlusCircle size={15} style={{ verticalAlign: "middle" }} />
          </span>
          Agregar Vinilo
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "csv" ? "active" : ""}`}
          onClick={() => setActiveTab("csv")}
        >
          <span style={{ marginRight: "0.4rem" }}>
            <Upload size={15} style={{ verticalAlign: "middle" }} />
          </span>
          Importar CSV
        </button>
      </div>

      {/* ===== STATS ===== */}
      {activeTab === "stats" && (
        <>
          {statsLoading && (
            <p style={{ color: "#6c757d" }}>Cargando estadísticas...</p>
          )}
          {stats && (
            <>
              {/* Stat cards */}
              <div className="admin-stats">
                <StatCard
                  label="Ingresos del mes"
                  value={formatMoney(stats.orders.ingresos_mes)}
                  sub={`Hoy: ${formatMoney(stats.orders.ingresos_hoy)}`}
                  variant="accent"
                />
                <StatCard
                  label="Ingresos totales"
                  value={formatMoney(stats.orders.ingresos_totales)}
                  sub={`${stats.orders.total} órdenes`}
                  variant="green"
                />
                <StatCard
                  label="Vinilos en catálogo"
                  value={stats.products.total}
                  sub={`${stats.products.sin_stock} sin stock`}
                  variant="blue"
                />
                <StatCard
                  label="Usuarios registrados"
                  value={stats.users.total}
                  sub={`${stats.users.admins} admin`}
                  variant="orange"
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                }}
              >
                {/* Top vinilos */}
                <div className="admin-card">
                  <div className="admin-card-title">
                    <Package
                      size={16}
                      style={{ verticalAlign: "middle", marginRight: "0.4rem" }}
                    />
                    Top 5 más vendidos
                  </div>
                  {stats.top_products.length === 0 ? (
                    <p style={{ color: "#6c757d", fontSize: "0.88rem" }}>
                      Aún no hay ventas registradas.
                    </p>
                  ) : (
                    <div className="admin-table-wrapper">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Vinilo</th>
                            <th>Unidades</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.top_products.map((p, i) => (
                            <tr key={p.id}>
                              <td>{i + 1}</td>
                              <td>
                                <div style={{ fontWeight: 600 }}>{p.title}</div>
                                <div
                                  style={{
                                    fontSize: "0.78rem",
                                    color: "#6c757d",
                                  }}
                                >
                                  {p.artist}
                                </div>
                              </td>
                              <td>{p.unidades_vendidas}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Últimas órdenes */}
                <div className="admin-card">
                  <div className="admin-card-title">
                    <ShoppingBag
                      size={16}
                      style={{ verticalAlign: "middle", marginRight: "0.4rem" }}
                    />
                    Últimas órdenes
                  </div>
                  {stats.recent_orders.length === 0 ? (
                    <p style={{ color: "#6c757d", fontSize: "0.88rem" }}>
                      Aún no hay órdenes.
                    </p>
                  ) : (
                    <div className="admin-table-wrapper">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recent_orders.map((o) => (
                            <tr key={o.id}>
                              <td>#{o.id}</td>
                              <td style={{ fontSize: "0.8rem" }}>
                                {o.first_name || o.last_name
                                  ? `${o.first_name || ""} ${o.last_name || ""}`.trim()
                                  : o.email || o.guest_email || "Invitado"}
                              </td>
                              <td>{formatMoney(parseFloat(o.total))}</td>
                              <td>
                                <span className={`admin-badge ${o.status}`}>
                                  {STATUS_LABELS[o.status] || o.status}
                                </span>
                              </td>
                              <td style={{ fontSize: "0.8rem" }}>
                                {formatDate(o.created_at)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ===== AGREGAR VINILO ===== */}
      {activeTab === "add-product" && (
        <div className="admin-card">
          <div className="admin-card-title">
            <PlusCircle
              size={16}
              style={{ verticalAlign: "middle", marginRight: "0.4rem" }}
            />
            Nuevo Vinilo
          </div>

          {productMessage && (
            <div
              className={
                productMessage.type === "success"
                  ? "admin-success"
                  : "admin-error-box"
              }
            >
              {productMessage.text}
            </div>
          )}

          <form className="admin-form" onSubmit={handleProductSubmit}>
            {/* Título */}
            <div className="admin-form-group">
              <label className="admin-form-label">Título *</label>
              <input
                className="admin-form-input"
                type="text"
                name="title"
                value={productForm.title}
                onChange={handleProductChange}
                placeholder="Ej: Abbey Road"
                required
              />
            </div>

            {/* Artista */}
            <div className="admin-form-group">
              <label className="admin-form-label">Artista *</label>
              <input
                className="admin-form-input"
                type="text"
                name="artist"
                value={productForm.artist}
                onChange={handleProductChange}
                placeholder="Ej: The Beatles"
                required
              />
            </div>

            {/* Precio */}
            <div className="admin-form-group">
              <label className="admin-form-label">Precio *</label>
              <input
                className="admin-form-input"
                type="number"
                name="price"
                value={productForm.price}
                onChange={handleProductChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Cuotas */}
            <div className="admin-form-group">
              <label className="admin-form-label">Cuotas sin interés</label>
              <input
                className="admin-form-input"
                type="number"
                name="installments"
                value={productForm.installments}
                onChange={handleProductChange}
                min="1"
                max="24"
              />
            </div>

            {/* Sello */}
            <div className="admin-form-group">
              <label className="admin-form-label">Sello / Label</label>
              <input
                className="admin-form-input"
                type="text"
                name="label"
                value={productForm.label}
                onChange={handleProductChange}
                placeholder="Ej: EMI, Atlantic..."
              />
            </div>

            {/* País */}
            <div className="admin-form-group">
              <label className="admin-form-label">País de origen</label>
              <input
                className="admin-form-input"
                type="text"
                name="country"
                value={productForm.country}
                onChange={handleProductChange}
                placeholder="Ej: UK, USA, Argentina..."
              />
            </div>

            {/* Condición tapa */}
            <div className="admin-form-group">
              <label className="admin-form-label">Condición tapa</label>
              <select
                className="admin-form-select"
                name="condition_cover"
                value={productForm.condition_cover}
                onChange={handleProductChange}
              >
                <option value="">Seleccionar...</option>
                <option value="M">M — Mint (Impecable)</option>
                <option value="VG+">VG+ — Very Good Plus</option>
                <option value="VG">VG — Very Good</option>
                <option value="G+">G+ — Good Plus</option>
                <option value="G">G — Good</option>
                <option value="F">F — Fair</option>
                <option value="P">P — Poor</option>
              </select>
            </div>

            {/* Condición disco */}
            <div className="admin-form-group">
              <label className="admin-form-label">Condición disco</label>
              <select
                className="admin-form-select"
                name="condition_media"
                value={productForm.condition_media}
                onChange={handleProductChange}
              >
                <option value="">Seleccionar...</option>
                <option value="M">M — Mint (Impecable)</option>
                <option value="VG+">VG+ — Very Good Plus</option>
                <option value="VG">VG — Very Good</option>
                <option value="G+">G+ — Good Plus</option>
                <option value="G">G — Good</option>
                <option value="F">F — Fair</option>
                <option value="P">P — Poor</option>
              </select>
            </div>

            {/* Categoría */}
            <div className="admin-form-group">
              <label className="admin-form-label">Categoría</label>
              <select
                className="admin-form-select"
                name="category_id"
                value={productForm.category_id}
                onChange={handleProductChange}
              >
                <option value="">Sin categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div className="admin-form-group">
              <label className="admin-form-label">Stock</label>
              <input
                className="admin-form-input"
                type="number"
                name="stock"
                value={productForm.stock}
                onChange={handleProductChange}
                min="0"
              />
            </div>

            {/* Descuento */}
            <div className="admin-form-group">
              <label className="admin-form-label">Descuento (%)</label>
              <input
                className="admin-form-input"
                type="number"
                name="discount_percentage"
                value={productForm.discount_percentage}
                onChange={handleProductChange}
                min="0"
                max="100"
              />
            </div>

            {/* Checkboxes */}
            <div
              className="admin-form-group"
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: "1.5rem",
                paddingTop: "0.5rem",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  cursor: "pointer",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                }}
              >
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={productForm.is_featured as boolean}
                  onChange={handleProductChange}
                />
                Destacado
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  cursor: "pointer",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                }}
              >
                <input
                  type="checkbox"
                  name="is_on_sale"
                  checked={productForm.is_on_sale as boolean}
                  onChange={handleProductChange}
                />
                En oferta
              </label>
            </div>

            {/* Descripción */}
            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">Descripción</label>
              <textarea
                className="admin-form-textarea"
                name="description"
                value={productForm.description}
                onChange={handleProductChange}
                placeholder="Descripción del vinilo, notas, estado, tracklist..."
              />
            </div>

            {/* Imágenes */}
            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">Fotos (máx. 10)</label>
              <div
                className="admin-image-dropzone"
                onClick={() => imageInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files).filter((f) =>
                    f.type.startsWith("image/"),
                  );
                  const newFiles = [...imageFiles, ...files].slice(0, 10);
                  setImageFiles(newFiles);
                  setImagePreviews(newFiles.map((f) => URL.createObjectURL(f)));
                }}
              >
                <Upload size={28} color="#adb5bd" />
                <div className="admin-image-dropzone-text">
                  Hacé click o arrastrá imágenes aquí
                  <br />
                  <span style={{ fontSize: "0.75rem" }}>
                    JPG, PNG, WebP — La primera foto será la principal
                  </span>
                </div>
              </div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleImageSelect}
              />
              {imagePreviews.length > 0 && (
                <div className="admin-image-previews">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="admin-image-thumb">
                      <img src={src} alt={`preview ${i + 1}`} />
                      <button
                        type="button"
                        className="admin-image-thumb-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(i);
                        }}
                        aria-label="Eliminar imagen"
                      >
                        <X size={10} />
                      </button>
                      {i === 0 && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: 2,
                            left: 2,
                            background: "var(--color-accent)",
                            color: "#fff",
                            fontSize: "9px",
                            padding: "1px 4px",
                            borderRadius: 4,
                            fontWeight: 700,
                          }}
                        >
                          PRINCIPAL
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botones */}
            <div
              className="admin-form-full"
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => {
                  setProductForm(EMPTY_PRODUCT);
                  setImageFiles([]);
                  setImagePreviews([]);
                  setProductMessage(null);
                }}
              >
                Limpiar
              </button>
              <button
                type="submit"
                className="admin-btn-primary"
                disabled={productLoading}
              >
                {productLoading ? "Guardando..." : "Crear Vinilo"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== CSV ===== */}
      {activeTab === "csv" && (
        <div className="admin-card">
          <div className="admin-card-title">
            <FileText
              size={16}
              style={{ verticalAlign: "middle", marginRight: "0.4rem" }}
            />
            Importar vinilos desde CSV
          </div>

          <p
            style={{
              fontSize: "0.88rem",
              color: "#6c757d",
              marginBottom: "1.25rem",
              lineHeight: 1.6,
            }}
          >
            Cargá un archivo CSV con los vinilos que querés agregar al catálogo.
            Las columnas reconocidas son: <strong>title</strong> (o titulo),{" "}
            <strong>artist</strong> (o artista), <strong>price</strong> (o
            precio), label, country, condition_cover, condition_media, category
            (nombre o ID), stock, is_featured, is_on_sale, discount_percentage,
            description.
          </p>

          {csvMessage && (
            <div
              className={
                csvMessage.type === "success"
                  ? "admin-success"
                  : "admin-error-box"
              }
            >
              <div>{csvMessage.text}</div>
              {csvMessage.errors && csvMessage.errors.length > 0 && (
                <ul
                  style={{
                    marginTop: "0.5rem",
                    paddingLeft: "1.2rem",
                    fontSize: "0.82rem",
                  }}
                >
                  {csvMessage.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div
            className="admin-csv-dropzone"
            onClick={() => csvInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (
                file &&
                (file.name.endsWith(".csv") || file.type === "text/csv")
              ) {
                setCsvFile(file);
                setCsvMessage(null);
              }
            }}
          >
            <div className="admin-csv-icon">📂</div>
            {csvFile ? (
              <div>
                <strong style={{ color: "var(--color-text-main)" }}>
                  {csvFile.name}
                </strong>
                <div className="admin-csv-text">
                  {(csvFile.size / 1024).toFixed(1)} KB — Listo para importar
                </div>
              </div>
            ) : (
              <div className="admin-csv-text">
                Hacé click o arrastrá el archivo CSV aquí
              </div>
            )}
          </div>

          <input
            ref={csvInputRef}
            type="file"
            accept=".csv,text/csv"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setCsvFile(file);
                setCsvMessage(null);
              }
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginTop: "1.25rem",
              justifyContent: "flex-end",
            }}
          >
            {csvFile && (
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => {
                  setCsvFile(null);
                  setCsvMessage(null);
                }}
              >
                Cancelar
              </button>
            )}
            <button
              type="button"
              className="admin-btn-primary"
              disabled={!csvFile || csvLoading}
              onClick={handleCsvSubmit}
            >
              {csvLoading ? "Importando..." : "Importar CSV"}
            </button>
          </div>

          {/* Plantilla de ejemplo */}
          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              background: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: "0.85rem",
                marginBottom: "0.5rem",
              }}
            >
              <Users
                size={14}
                style={{ verticalAlign: "middle", marginRight: "4px" }}
              />
              Ejemplo de formato CSV:
            </div>
            <pre
              style={{
                fontSize: "0.75rem",
                color: "#495057",
                overflowX: "auto",
                background: "#fff",
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid #dee2e6",
                lineHeight: 1.6,
              }}
            >
              {`title,artist,price,label,country,condition_cover,condition_media,category,stock
Abbey Road,The Beatles,15000,EMI,UK,VG+,VG+,Bandas Internacionales,1
Kind of Blue,Miles Davis,12000,Columbia,USA,VG,VG+,Jazz,2`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
