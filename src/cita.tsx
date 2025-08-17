import React, { useMemo, useRef, useState, useEffect } from "react";

import { createPortal } from "react-dom";
/** ====== Tipos ====== */
type Expert = {
  id: string;
  nombre: string;
  edad: number;
  universidad: string;
  especialidad: string;
  foto?: string; // <-- pon aquí la URL de la foto si tienes
};

/** ====== Datos de ejemplo (pon tus fotos en /public/images/experts/...) ====== */
const EXPERTOS: Expert[] = [
  {
    id: "carlos",
    nombre: "Dr. Carlos Ramírez",
    edad: 32,
    universidad: "Unitec",
    especialidad: "Adolescentes con ansiedad y depresión",
    foto: "/images/carlos.jpg",
  },
  {
    id: "sofia",
    nombre: "Dra. Sofía Méndez",
    edad: 36,
    universidad: "UNAM",
    especialidad: "Manejo de estrés en adultos",
    foto: "/images/sofia.jpg",
  },
  {
    id: "andres",
    nombre: "Mtro. Andrés Pérez",
    edad: 40,
    universidad: "U. de Guadalajara",
    especialidad: "Terapia de pareja",
    foto: "/images/andres.jpg",
  },
  {
    id: "paula",
    nombre: "Psic. Paula Morales",
    edad: 29,
    universidad: "UANL",
    especialidad: "Autoestima y habilidades sociales",
    foto: "/images/paula.jpg",
  },
  {
    id: "luis",
    nombre: "Dr. Luis Fernández",
    edad: 45,
    universidad: "IPN",
    especialidad: "Trastornos del ánimo",
    foto: "/images/luis.jpg",
  },
];

/** Utilidad: iniciales si no hay foto */
function initialsFromName(name: string) {
  const parts = name.split(" ").filter(Boolean);
  const pick = (s: string) => s[0]?.toUpperCase() ?? "";
  if (!parts.length) return "?";
  if (parts.length === 1) return pick(parts[0]);
  return pick(parts[0]) + pick(parts[parts.length - 1]);
}


function Portal({ children }: { children: React.ReactNode }) {
  const el = useMemo(() => document.createElement("div"), []);
  useEffect(() => {
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }, [el]);
  return createPortal(children, el);
}

export function AgendaModal({
  experto,
  onClose,
}: {
  experto: { id: string; nombre: string } | null;
  onClose: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  // bloquea scroll del body mientras el modal esté abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const hoy = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(formRef.current!);
    alert(`✅ Cita con ${experto?.nombre}\nFecha: ${fd.get("fecha")}\nHora: ${fd.get("hora")}`);
    onClose();
  };

  if (!experto) return null;
    
   return (
    <Portal>
      {/* MODAL */}
      <div className="modal modal-mc fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-semibold text-mc">Agendar cita con {experto.nombre}</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar" />
            </div>
            <div className="modal-body">
              <form ref={formRef} onSubmit={submit} className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Fecha</label>
                  <input name="fecha" type="date" className="form-control" min={hoy} required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Hora</label>
                  <input name="hora" type="time" className="form-control" required />
                </div>
                <div className="col-12">
                  <label className="form-label">Motivo</label>
                  <select name="motivo" className="form-select" defaultValue="Consulta inicial" required>
                    <option>Consulta inicial</option>
                    <option>Seguimiento</option>
                    <option>Ansiedad/Estrés</option>
                    <option>Depresión</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Notas (opcional)</label>
                  <textarea name="notas" rows={3} className="form-control" placeholder="Comparte un contexto breve..." />
                </div>
                <div className="col-12 d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
                  <button type="submit" className="btn btn-mc">Confirmar cita</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* BACKDROP (debajo del modal) */}
      <div className="modal-backdrop modal-mc-backdrop fade show" onClick={onClose} />
    </Portal>
  );
}

/** ====== Página ====== */
export default function AgendaPage() {
  const [seleccionado, setSeleccionado] = useState<Expert | null>(null);

  // Limpia scroll al abrir modal manual
  useEffect(() => {
    if (seleccionado) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [seleccionado]);

  return (
    <section className="experts-section py-4">
      <div className="container-xxl">
        <h2 className="h4 h2-md fw-bold text-center text-mc mb-4">
          Conoce a Nuestros Expertos
        </h2>

        <div className="row g-4 justify-content-center">
          {EXPERTOS.map((doc) => (
            <div key={doc.id} className="col-12 col-xl-10">
              <div className="expert-card p-4 p-md-5 d-flex align-items-center gap-4 flex-wrap">
                {/* Avatar */}
                <div className="doc-avatar">
                  {doc.foto ? (
                    <img src={doc.foto} alt={doc.nombre} />
                  ) : (
                    <span className="doc-initial">{initialsFromName(doc.nombre)}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-grow-1">
                  <h3 className="doc-name mb-1">{doc.nombre}</h3>
                  <div className="doc-meta small mb-2">
                    {doc.edad} años • Estudió en {doc.universidad}
                  </div>
                  <div className="doc-spec text-mc">
                    Especialista en {doc.especialidad}
                  </div>

                  <button
                    className="btn btn-mc rounded-pill px-4 mt-3"
                    onClick={() => setSeleccionado(doc)}
                  >
                    Agendar Cita
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {seleccionado && (
          <AgendaModal
            experto={seleccionado}
            onClose={() => setSeleccionado(null)}
          />
        )}
      </div>
    </section>
  );
}
