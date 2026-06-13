import { useEffect, useState } from "react";
import {
  getCatalogs,
  createCatalogItem,
  updateCatalogItem,
  deleteCatalogItem,
} from "../../api/admin";
import type { CatalogItem, Catalogs } from "../../types";

type CatalogKey = keyof Catalogs;

const CATALOG_LABELS: Record<CatalogKey, string> = {
  banks: "Bancos",
  carriers: "Compañías de celular",
  pensionInstitutions: "Instituciones de pensión",
  departmentCards: "Tarjetas departamentales",
  socialPrograms: "Programas sociales",
  internetProviders: "Proveedores de internet",
  electricityProviders: "Proveedores de luz",
  waterProviders: "Proveedores de agua",
  onlineStores: "Tiendas en línea",
};

function CatalogSection({
  title,
  catalogKey,
  items,
  onAdd,
  onUpdate,
  onDelete,
}: {
  title: string;
  catalogKey: CatalogKey;
  items: CatalogItem[];
  onAdd: (key: CatalogKey, label: string) => Promise<void>;
  onUpdate: (key: CatalogKey, item: CatalogItem) => Promise<void>;
  onDelete: (key: CatalogKey, id: string) => Promise<void>;
}) {
  const [newLabel, setNewLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  async function handleAdd() {
    if (!newLabel.trim()) return;
    setAdding(true);
    try {
      await onAdd(catalogKey, newLabel.trim());
      setNewLabel("");
    } finally {
      setAdding(false);
    }
  }

  async function handleSaveEdit(item: CatalogItem) {
    if (!editLabel.trim()) return;
    setBusy(item.id);
    try {
      await onUpdate(catalogKey, { ...item, label: editLabel.trim() });
      setEditingId(null);
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete(id: string) {
    setBusy(id);
    try {
      await onDelete(catalogKey, id);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
          {items.length} elementos
        </span>
      </div>

      {/* Item list */}
      <div className="divide-y divide-slate-100">
        {items.length === 0 && (
          <p className="px-5 py-4 text-sm text-slate-400 italic">
            Sin elementos. Agrega el primero.
          </p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 px-5 py-3">
            {editingId === item.id ? (
              <input
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleSaveEdit(item);
                  if (e.key === "Escape") setEditingId(null);
                }}
                autoFocus
                className="flex-1 px-3 py-1.5 rounded-lg border border-purple-400 text-sm outline-none ring-2 ring-purple-100"
              />
            ) : (
              <span className="flex-1 text-sm text-slate-700">
                {item.label}
              </span>
            )}

            <div className="flex items-center gap-1 flex-shrink-0">
              {editingId === item.id ? (
                <>
                  <button
                    onClick={() => void handleSaveEdit(item)}
                    disabled={busy === item.id}
                    className="px-3 py-1.5 bg-purple-700 text-white rounded-lg text-xs font-semibold hover:bg-purple-800 disabled:opacity-50 transition-colors"
                  >
                    {busy === item.id ? "..." : "Guardar"}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setEditLabel(item.label);
                    }}
                    className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                    title="Editar"
                  >
                    <i className="pi pi-pencil text-xs" />
                  </button>
                  <button
                    onClick={() => void handleDelete(item.id)}
                    disabled={busy === item.id}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    title="Eliminar"
                  >
                    {busy === item.id ? (
                      <span className="inline-block w-3 h-3 border border-slate-300 border-t-red-500 rounded-full animate-spin" />
                    ) : (
                      <i className="pi pi-trash text-xs" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add new */}
      <div className="border-t border-slate-100 px-5 py-4 flex gap-2 bg-slate-50">
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void handleAdd();
          }}
          placeholder={`Nuevo elemento...`}
          className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 bg-white"
        />
        <button
          onClick={handleAdd}
          disabled={adding || !newLabel.trim()}
          className="px-4 py-2 bg-purple-700 hover:bg-purple-800 disabled:bg-purple-300 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
        >
          {adding ? (
            <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <i className="pi pi-plus" />
          )}
          Agregar
        </button>
      </div>
    </div>
  );
}

export function CatalogManager() {
  const [catalogs, setCatalogs] = useState<Catalogs>({
    banks: [],
    carriers: [],
    pensionInstitutions: [],
    departmentCards: [],
    socialPrograms: [],
    internetProviders: [],
    electricityProviders: [],
    waterProviders: [],
    onlineStores: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCatalogs()
      .then(setCatalogs)
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(key: CatalogKey, label: string) {
    const newItem = await createCatalogItem(key, { label });
    setCatalogs((prev) => ({ ...prev, [key]: [...prev[key], newItem] }));
  }

  async function handleUpdate(key: CatalogKey, item: CatalogItem) {
    const updatedItem = await updateCatalogItem(key, item);
    setCatalogs((prev) => ({
      ...prev,
      [key]: prev[key].map((i) => (i.id === item.id ? updatedItem : i)),
    }));
  }

  async function handleDelete(key: CatalogKey, id: string) {
    await deleteCatalogItem(key, id);
    setCatalogs((prev) => ({
      ...prev,
      [key]: prev[key].filter((i) => i.id !== id),
    }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Catálogos</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Administra las opciones que aparecen en los formularios de registro.
        </p>
      </div>

      <div className="space-y-5">
        {(Object.entries(CATALOG_LABELS) as [CatalogKey, string][]).map(
          ([key, label]) => (
            <CatalogSection
              key={key}
              title={label}
              catalogKey={key}
              items={catalogs[key]}
              onAdd={handleAdd}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ),
        )}
      </div>
    </div>
  );
}
