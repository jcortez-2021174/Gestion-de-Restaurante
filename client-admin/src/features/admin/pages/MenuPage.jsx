import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminLayout } from "../../../shared/layouts/AdminLayout";
import {
  actualizar as actualizarCategoria,
  crear as crearCategoria,
  eliminar as eliminarCategoria,
  obtenerTodas,
} from "../../../services/categorias.service";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  listarProductos,
} from "../../../services/productos.service";
import "../styles/menu.css";
import { ExportButtons } from "../../../shared/components/ExportButtons";

const emptyProduct = {
  id: null,
  nombre: "",
  descripcion: "",
  precio: "",
  disponibilidad: "Disponible",
  idCategoria: "",
  imagen: "",
};

const emptyCategory = { id: null, nombre: "", descripcion: "", estado: "ACTIVO" };

const normalizeProduct = (product) => {
  const category = product.idCategoria;
  return {
    id: product._id || product.id,
    nombre: product.nombre,
    descripcion: product.descripcion || "",
    precio: Number(product.precio),
    disponibilidad: product.disponibilidad,
    idCategoria: category?._id || category || "",
    categoriaNombre: category?.nombre || "Sin categoria",
    imagen: product.imagen || "/plato1.jpeg",
  };
};

const readImage = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

export const MenuPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [productForm, setProductForm] = useState(null);
  const [categoryForm, setCategoryForm] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [productResponse, categoryResponse] = await Promise.all([
        listarProductos(),
        obtenerTodas(),
      ]);
      setProducts((productResponse.data || productResponse || []).map(normalizeProduct));
      setCategories(categoryResponse.data || categoryResponse || []);
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message || "No se pudo cargar el menu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial API synchronization for this route.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => (
      (!term || product.nombre.toLowerCase().includes(term))
      && (!categoryFilter || product.idCategoria === categoryFilter)
    ));
  }, [products, search, categoryFilter]);

  const notify = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2500);
  };

  const saveProduct = async () => {
    if (!productForm.nombre.trim() || !productForm.idCategoria || productForm.precio === "") {
      setError("Nombre, categoria y precio son obligatorios.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const payload = {
        nombre: productForm.nombre.trim(),
        descripcion: productForm.descripcion.trim(),
        precio: Number(productForm.precio),
        disponibilidad: productForm.disponibilidad,
        idCategoria: productForm.idCategoria,
        imagen: productForm.imagen,
      };
      if (productForm.id) await actualizarProducto(productForm.id, payload);
      else await crearProducto(payload);
      setProductForm(null);
      notify(productForm.id ? "Producto actualizado." : "Producto creado.");
      await loadData();
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (product) => {
    if (!window.confirm(`Eliminar ${product.nombre}?`)) return;
    try {
      await eliminarProducto(product.id);
      notify("Producto eliminado.");
      await loadData();
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message);
    }
  };

  const toggleAvailability = async (product) => {
    await actualizarProducto(product.id, {
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      disponibilidad: product.disponibilidad === "Disponible" ? "NoDisponible" : "Disponible",
      idCategoria: product.idCategoria,
      imagen: product.imagen,
    });
    await loadData();
  };

  const saveCategory = async () => {
    if (categoryForm.nombre.trim().length < 3) {
      setError("El nombre de categoria debe tener al menos 3 caracteres.");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        nombre: categoryForm.nombre.trim(),
        descripcion: categoryForm.descripcion.trim(),
        estado: categoryForm.estado,
      };
      if (categoryForm.id) await actualizarCategoria(categoryForm.id, payload);
      else await crearCategoria(payload);
      setCategoryForm(null);
      notify("Categoria guardada.");
      await loadData();
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const removeCategory = async (category) => {
    if (!window.confirm(`Eliminar la categoria ${category.nombre}?`)) return;
    try {
      await eliminarCategoria(category._id);
      notify("Categoria eliminada.");
      await loadData();
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message);
    }
  };

  return (
    <AdminLayout notificationCount={0}>
      <header className="admin-module-header">
        <div>
          <span className="admin-eyebrow">Catalogo operativo</span>
          <h1>Productos y categorias</h1>
          <p>Los cambios se publican directamente en el menu del cliente.</p>
        </div>
        <div className="admin-header-actions">
          <ExportButtons
            basename={`productos-aurea-${new Date().toISOString().slice(0, 10)}`}
            title="Catálogo de productos"
            columns={[
              { key: "id", label: "ID" },
              { key: "nombre", label: "Producto" },
              { key: "categoriaNombre", label: "Categoria" },
              { key: "precio", label: "Precio" },
              { key: "disponibilidad", label: "Disponibilidad" },
            ]}
            rows={filteredProducts}
            summary={`${filteredProducts.length} productos`}
          />
          <button className="btn-outline" onClick={() => setCategoryForm({ ...emptyCategory })}>
            Nueva categoria
          </button>
          <button className="btn-gold" onClick={() => setProductForm({ ...emptyProduct })}>
            Nuevo producto
          </button>
        </div>
      </header>

      {error && <div className="admin-feedback error">{error}</div>}
      {message && <div className="admin-feedback success">{message}</div>}

      <section className="menu-admin-stats">
        <article><strong>{products.length}</strong><span>Productos</span></article>
        <article><strong>{categories.length}</strong><span>Categorias</span></article>
        <article><strong>{products.filter((item) => item.disponibilidad === "Disponible").length}</strong><span>Disponibles</span></article>
        <article><strong>{products.filter((item) => item.disponibilidad !== "Disponible").length}</strong><span>Agotados</span></article>
      </section>

      <section className="menu-admin-grid">
        <div className="card menu-admin-products">
          <div className="menu-admin-toolbar">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar productos..." />
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="">Todas las categorias</option>
              {categories.map((category) => <option key={category._id} value={category._id}>{category.nombre}</option>)}
            </select>
          </div>

          {loading ? <div className="loading-state">Cargando catalogo...</div> : (
            <div className="menu-admin-list">
              {filteredProducts.map((product) => (
                <article key={product.id} className="menu-admin-row">
                  <img src={product.imagen} alt={product.nombre} />
                  <div className="menu-admin-copy">
                    <h3>{product.nombre}</h3>
                    <span>{product.categoriaNombre}</span>
                    <p>{product.descripcion || "Sin descripcion"}</p>
                  </div>
                  <strong>Q{product.precio.toFixed(2)}</strong>
                  <button className={`availability-pill ${product.disponibilidad}`} onClick={() => toggleAvailability(product)}>
                    {product.disponibilidad === "Disponible" ? "Disponible" : "Agotado"}
                  </button>
                  <div className="row-actions">
                    <button onClick={() => setProductForm({ ...product })}><i className="ri-edit-line" /></button>
                    <button className="danger" onClick={() => removeProduct(product)}><i className="ri-delete-bin-line" /></button>
                  </div>
                </article>
              ))}
              {!filteredProducts.length && <div className="empty-state">No hay productos para mostrar.</div>}
            </div>
          )}
        </div>

        <aside className="card menu-admin-categories">
          <div className="section-header">
            <div><span className="admin-eyebrow">Organizacion</span><h2>Categorias</h2></div>
          </div>
          <input
            className="category-search"
            value={categorySearch}
            onChange={(event) => setCategorySearch(event.target.value)}
            placeholder="Buscar categoria..."
          />
          {categories.filter((category) => (
            category.nombre.toLowerCase().includes(categorySearch.trim().toLowerCase())
          )).map((category) => (
            <article key={category._id} className="category-admin-row">
              <div>
                <strong>{category.nombre}</strong>
                <span>{category.productos || 0} producto(s)</span>
              </div>
              <button onClick={() => setCategoryForm({
                id: category._id,
                nombre: category.nombre,
                descripcion: category.descripcion || "",
                estado: category.estado || "ACTIVO",
              })}><i className="ri-edit-line" /></button>
              <button disabled={category.productos > 0} onClick={() => removeCategory(category)}>
                <i className="ri-delete-bin-line" />
              </button>
            </article>
          ))}
        </aside>
      </section>

      {productForm && (
        <div className="modal-overlay" onClick={() => setProductForm(null)}>
          <div className="modal-box product-editor" onClick={(event) => event.stopPropagation()}>
            <h2>{productForm.id ? "Editar producto" : "Nuevo producto"}</h2>
            <div className="product-editor-grid">
              <div className="modal-form">
                <input value={productForm.nombre} onChange={(event) => setProductForm({ ...productForm, nombre: event.target.value })} placeholder="Nombre" />
                <textarea value={productForm.descripcion} onChange={(event) => setProductForm({ ...productForm, descripcion: event.target.value })} placeholder="Descripcion" />
                <input type="number" min="0" step="0.01" value={productForm.precio} onChange={(event) => setProductForm({ ...productForm, precio: event.target.value })} placeholder="Precio" />
                <select value={productForm.idCategoria} onChange={(event) => setProductForm({ ...productForm, idCategoria: event.target.value })}>
                  <option value="">Selecciona categoria</option>
                  {categories.map((category) => <option key={category._id} value={category._id}>{category.nombre}</option>)}
                </select>
                <select value={productForm.disponibilidad} onChange={(event) => setProductForm({ ...productForm, disponibilidad: event.target.value })}>
                  <option value="Disponible">Disponible</option>
                  <option value="NoDisponible">Agotado</option>
                </select>
                <input type="file" accept="image/*" onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (file) setProductForm({ ...productForm, imagen: await readImage(file) });
                }} />
              </div>
              <div className="product-preview">
                <img src={productForm.imagen || "/plato1.jpeg"} alt="Vista previa" />
                <span>Vista previa</span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setProductForm(null)}>Cancelar</button>
              <button className="modal-save" disabled={saving} onClick={saveProduct}>{saving ? "Guardando..." : "Guardar"}</button>
            </div>
          </div>
        </div>
      )}

      {categoryForm && (
        <div className="modal-overlay" onClick={() => setCategoryForm(null)}>
          <div className="modal-box" onClick={(event) => event.stopPropagation()}>
            <h2>{categoryForm.id ? "Editar categoria" : "Nueva categoria"}</h2>
            <div className="modal-form">
              <input value={categoryForm.nombre} onChange={(event) => setCategoryForm({ ...categoryForm, nombre: event.target.value })} placeholder="Nombre" />
              <textarea value={categoryForm.descripcion} onChange={(event) => setCategoryForm({ ...categoryForm, descripcion: event.target.value })} placeholder="Descripcion" />
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setCategoryForm(null)}>Cancelar</button>
              <button className="modal-save" disabled={saving} onClick={saveCategory}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
