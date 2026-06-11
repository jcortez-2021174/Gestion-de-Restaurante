import { useEffect, useMemo, useState } from "react";
import { FaChair, FaPlus, FaSearch, FaUsers } from "react-icons/fa";
import { AdminLayout } from "../../../shared/layouts/AdminLayout";
import {
    actualizar,
    crear,
    eliminar,
    obtenerTodas
} from "../../../services/mesas.service";
import "../styles/mesas.css";

const ESTADOS = {
    DISPONIBLE: "available",
    OCUPADA: "occupied",
    RESERVADA: "reserved"
};

const LABELS = {
    DISPONIBLE: "Disponible",
    OCUPADA: "Ocupada",
    RESERVADA: "Reservada"
};

const emptyForm = {
    numero: "",
    capacidad: "",
    estado: "DISPONIBLE"
};

export const MesasPage = () => {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [activeFilter, setActiveFilter] = useState("Todas");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    const loadTables = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await obtenerTodas();
            setTables(data);
            setSelectedTable((current) => {
                if (!data.length) return null;
                return data.find((table) => table.id === current?.id) || data[0];
            });
        } catch (err) {
            setError(err.userMessage || err.message || "No se pudieron cargar las mesas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTables();
    }, []);

    const filteredTables = useMemo(() => tables.filter((table) => {
        const matchesSearch = `Mesa ${table.numero}`
            .toLowerCase()
            .includes(search.toLowerCase());

        if (activeFilter === "Todas") return matchesSearch;
        return matchesSearch && table.estado === activeFilter;
    }), [tables, activeFilter, search]);

    const counts = useMemo(() => ({
        total: tables.length,
        disponibles: tables.filter((table) => table.estado === "DISPONIBLE").length,
        ocupadas: tables.filter((table) => table.estado === "OCUPADA").length,
        reservadas: tables.filter((table) => table.estado === "RESERVADA").length
    }), [tables]);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const startEdit = (table) => {
        setEditingId(table.id);
        setForm({
            numero: table.numero,
            capacidad: table.capacidad,
            estado: table.estado
        });
    };

    const saveTable = async () => {
        try {
            setSaving(true);
            setError("");

            if (editingId) {
                await actualizar(editingId, form);
            } else {
                await crear(form);
            }

            resetForm();
            await loadTables();
        } catch (err) {
            setError(err.userMessage || err.message || "No se pudo guardar la mesa.");
        } finally {
            setSaving(false);
        }
    };

    const deleteTable = async (tableId) => {
        try {
            setSaving(true);
            setError("");
            await eliminar(tableId);
            resetForm();
            await loadTables();
        } catch (err) {
            setError(err.userMessage || err.message || "No se pudo eliminar la mesa.");
        } finally {
            setSaving(false);
        }
    };

    const renderTable = (table) => (
        <div
            key={table.id}
            className={`table-card ${ESTADOS[table.estado] || "available"} square ${selectedTable?.id === table.id ? "active-table" : ""}`}
            onClick={() => setSelectedTable(table)}
        >
            <div className="table-glow"></div>
            <span className="chair top"></span>
            <span className="chair bottom"></span>
            <span className="chair left"></span>
            <span className="chair right"></span>

            <div className="table-number">Mesa {table.numero}</div>
            <div className="table-capacity">
                <FaUsers />
                <span>{table.capacidad} Pers.</span>
            </div>
            <div className="table-label">{LABELS[table.estado]}</div>
        </div>
    );

    return (
        <AdminLayout notificationCount={counts.ocupadas}>
            <section className="tables-layout">
                <div className="tables-content">
                    <div className="tables-top">
                        <div className="tables-title">
                            <h2><FaChair /> Mesas</h2>
                            <p>Gestiona mesas reales almacenadas en MongoDB.</p>
                        </div>

                        <button className="new-table-btn" onClick={resetForm}>
                            <FaPlus /> Nueva Mesa
                        </button>
                    </div>

                    {error && (
                        <div className="error-state">
                            <p>{error}</p>
                            <button onClick={loadTables}>Reintentar</button>
                        </div>
                    )}

                    <div className="tables-filters">
                        <div className="tabs">
                            {["Todas", "DISPONIBLE", "OCUPADA", "RESERVADA"].map((filter) => (
                                <button
                                    key={filter}
                                    className={activeFilter === filter ? "active" : ""}
                                    onClick={() => setActiveFilter(filter)}
                                >
                                    {filter === "Todas" ? "Todas" : LABELS[filter]}
                                </button>
                            ))}
                        </div>

                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Buscar mesa..."
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                            <FaSearch />
                        </div>
                    </div>

                    <div className="tables-stats">
                        <div className="stat-card">
                            <div className="stat-icon"><FaChair /></div>
                            <div><h3>{counts.total}</h3><span>Total</span></div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><FaChair /></div>
                            <div><h3>{counts.disponibles}</h3><span>Disponibles</span></div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><FaChair /></div>
                            <div><h3>{counts.ocupadas}</h3><span>Ocupadas</span></div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><FaChair /></div>
                            <div><h3>{counts.reservadas}</h3><span>Reservadas</span></div>
                        </div>
                    </div>

                    <div className="tables-section card">
                        {loading ? (
                            <div className="loading-state">Cargando mesas...</div>
                        ) : filteredTables.length ? (
                            <div className="tables-grid">
                                {filteredTables.map(renderTable)}
                            </div>
                        ) : (
                            <div className="empty-state">No hay mesas para mostrar.</div>
                        )}
                    </div>
                </div>

                <aside className="table-details card">
                    <h2>{editingId ? "Editar Mesa" : "Nueva Mesa"}</h2>
                    <p>Los cambios se guardan directamente en MongoDB.</p>

                    <div className="modal-form">
                        <input
                            type="number"
                            min="1"
                            placeholder="Numero"
                            value={form.numero}
                            onChange={(event) => setForm({ ...form, numero: event.target.value })}
                        />
                        <input
                            type="number"
                            min="1"
                            placeholder="Capacidad"
                            value={form.capacidad}
                            onChange={(event) => setForm({ ...form, capacidad: event.target.value })}
                        />
                        <select
                            value={form.estado}
                            onChange={(event) => setForm({ ...form, estado: event.target.value })}
                        >
                            <option value="DISPONIBLE">Disponible</option>
                            <option value="OCUPADA">Ocupada</option>
                            <option value="RESERVADA">Reservada</option>
                        </select>

                        <button className="gold-btn" disabled={saving} onClick={saveTable}>
                            {saving ? "Guardando..." : editingId ? "Guardar Cambios" : "Crear Mesa"}
                        </button>
                    </div>

                    {selectedTable && (
                        <div className="detail-section">
                            <h3>Mesa seleccionada</h3>
                            <div className="detail-item">
                                <span>Numero</span>
                                <strong>{selectedTable.numero}</strong>
                            </div>
                            <div className="detail-item">
                                <span>Capacidad</span>
                                <strong>{selectedTable.capacidad} personas</strong>
                            </div>
                            <div className="detail-item">
                                <span>Estado</span>
                                <strong>{LABELS[selectedTable.estado]}</strong>
                            </div>

                            <div className="table-actions">
                                <button className="gold-btn" onClick={() => startEdit(selectedTable)}>
                                    Editar Mesa
                                </button>
                                <button
                                    className="danger-btn"
                                    disabled={saving}
                                    onClick={() => deleteTable(selectedTable.id)}
                                >
                                    Eliminar Mesa
                                </button>
                            </div>
                        </div>
                    )}
                </aside>
            </section>
        </AdminLayout>
    );
};
