// src/components/UpgradePlans.tsx
import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

/* ---------- Modal con Portal ---------- */
function ConfirmModal({
  planTitle,
  onConfirm,
  onClose,
}: {
  planTitle: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  
  const el = useMemo(() => document.createElement("div"), []);
  useEffect(() => {
    document.body.appendChild(el);
    // bloquear scroll mientras esté abierto
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      document.body.removeChild(el);
    };
  }, [el]);

  return createPortal(
    <>
      <div className="modal fade show d-block modal-mc" role="dialog" aria-modal="true" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-semibold text-mc">Confirmar upgrade</h5>
              <button className="btn-close" aria-label="Cerrar" onClick={onClose} />
            </div>
            <div className="modal-body">
              ¿Quieres cambiar tu suscripción al <strong>{planTitle}</strong>?
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
              <button className="btn btn-mc" onClick={onConfirm}>Confirmar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop debajo del modal */}
      <div className="modal-backdrop fade show modal-mc-backdrop" onClick={onClose} />
    </>,
    el
  );
}

/* ---------- Datos ---------- */
type Plan = {
  id: "free" | "premium" | "pro";
  title: string;
  features: string[];
  popular?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "free",
    title: "Plan Gratuito",
    features: [
      "Chatbot AI Mindy 24/7",
      "Consejos emocionales personalizados",
      "Herramientas básicas de autocuidado",
      "Seguimiento emocional diario",
      "✅ Perfecto para iniciar tu camino al bienestar",
    ],
  },
  {
    id: "premium",
    title: "Plan Premium",
    popular: true,
    features: [
      "Todo lo del plan gratuito",
      "2 sesiones al mes con psicólogo profesional",
      "Contenido exclusivo (podcasts, guías, ejercicios)",
      "Chat en vivo con Mindy+",
      "✅ Ideal para acompañamiento constante y profesional",
    ],
  },
  {
    id: "pro",
    title: "Plan Pro",
    features: [
      "Todo lo anterior",
      "Sesiones ilimitadas con psicólogo profesional",
      "Reportes personalizados de bienestar",
      "Soporte para equipos de RRHH (empresas)",
      "Acceso prioritario y contenido premium",
      "✅ Para necesidades continuas o equipos",
    ],
  },
];

/* ---------- Página ---------- */
export default function UpgradePlans() {
  const [planToConfirm, setPlanToConfirm] = useState<Plan | null>(null);

  const onUpgradeClick = (p: Plan) => setPlanToConfirm(p);

  const confirmUpgrade = () => {
    if (!planToConfirm) return;
    // Conecta aquí tu checkout o API
    alert(`🚀 Upgrade a: ${planToConfirm.title}`);
    setPlanToConfirm(null);
  };

  return (
    <section className="plans-section py-5">
      <div className="container-xxl" style={{ marginTop: "5rem" }}>
        {/* ↓ más espacio superior */}
        <h2 className="h3 fw-bold text-center text-mc mb-4 mt-3" style={{ marginTop: "5rem" }}>Nuestros Planes</h2>

        <div className="row g-4 justify-content-center mt-2">
          {PLANS.map((plan) => (
            <div key={plan.id} className="col-12 col-md-6 col-lg-4 d-flex">
              <article className={`pricing-card w-100 ${plan.popular ? "is-popular" : ""}`}>
                {plan.popular && <span className="ribbon-popular">Más popular</span>}

                <header className="mb-3">
                  <h3 className="pricing-title">{plan.title}</h3>
                  <small className="text-white-50">Incluye:</small>
                </header>

                <ul className="pricing-list">
                  {plan.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>

                <button className="btn btn-mc rounded-pill mt-auto" onClick={() => onUpgradeClick(plan)}>
                  Upgrade plan
                </button>
              </article>
            </div>
          ))}
        </div>
      </div>

      {planToConfirm && (
        <ConfirmModal
          planTitle={planToConfirm.title}
          onConfirm={confirmUpgrade}
          onClose={() => setPlanToConfirm(null)}
        />
      )}
    </section>
  );
}
