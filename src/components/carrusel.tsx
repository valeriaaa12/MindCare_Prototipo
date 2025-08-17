import React, { useEffect, useRef } from "react";

type Testimonial = { icon: string | React.ReactNode; name: string; role: string; text: string };

const ITEMS: Testimonial[] = [
  {
    icon: "bi-chat-heart",
    name: "Ana, 27",
    role: "Estudiante",
    text:
      "Tenía picos de ansiedad antes de cada examen. Con Mindy practiqué respiración 4-7-8 y registro de emociones. " +
      "Ahora identifico mis disparadores, hago una mini rutina previa y me concentro mucho mejor.",
  },
  {
    icon: "bi-emoji-smile",
    name: "Carlos, 34",
    role: "Diseñador UX",
    text:
      "El trabajo remoto me pasaba factura. El chatbot me dio micro-pausas guiadas, una checklist diaria y recordatorios. " +
      "A las dos semanas dormía mejor y bajó la tensión en cuello y hombros.",
  },
  {
    icon: "bi-heart-pulse",
    name: "María, 41",
    role: "Emprendedora",
    text:
      "Usé reencuadre cognitivo y seguimientos semanales para decidir con menos ansiedad durante el lanzamiento. " +
      "Hoy me siento más enfocada y en control.",
  },
  {
    icon: "bi-stars",
    name: "Diego, 22",
    role: "Universitario",
    text:
      "Mindy fue mi primer paso para pedir ayuda. Me escuchó sin juzgar, me mostró recursos y reservé una sesión con una psicóloga. " +
      "Saber que hay apoyo 24/7 me dio calma.",
  },
  {
    icon: "bi bi-bandaid",
    name: "Lucía, 30",
    role: "Ing. de datos",
    text:
      "La combinación IA + profesionales es clave. El chatbot me da herramientas puntuales y, cuando necesito más, " +
      "coordino videosesiones seguras. Mi bienestar ya no es un ‘pendiente’.",
  },
];

export default function TestimonialsCarouselPanel() {
  const id = "testimonialsPanel";
  const ref = useRef<HTMLDivElement>(null);

  // autoplay 10s con limpieza segura
  useEffect(() => {
    const el = ref.current;
    const BS = (window as any)?.bootstrap;
    if (!el || !BS?.Carousel) return;
    BS.Carousel.getInstance(el)?.dispose?.();
    const inst = new BS.Carousel(el, {
      interval: 10000,
      ride: "carousel",
      pause: false,
      touch: true,
      wrap: true,
    });
    return () => inst?.dispose?.();
  }, []);

  return (
    <section className="py-5">
      <div className="container-xxl">
        <h2 className="h3 fw-semibold text-mc text-center mb-4">Testimonios de clientes</h2>

        <div
          id={id}
          ref={ref}
          className="carousel slide tcar"
          data-bs-ride="carousel"
          data-bs-interval="10000"
          data-bs-touch="true"
        >
          {/* Indicadores */}
          <div className="carousel-indicators">
            {ITEMS.map((_, i) => (
              <button
                key={i}
                type="button"
                data-bs-target={`#${id}`}
                data-bs-slide-to={i}
                className={i === 0 ? "active" : ""}
                aria-current={i === 0 ? "true" : undefined}
                aria-label={`Testimonio ${i + 1}`}
              />
            ))}
          </div>

          {/* Slides */}
          <div className="carousel-inner">
            {ITEMS.map((t, i) => (
              <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                <div className="row justify-content-center">
                  <div className="col-12 col-lg-10 col-xxl-8">
                    <article className="t-panel">
                      <div className="t-badge">
                        {typeof t.icon === "string" ? <i className={`bi ${t.icon}`} /> : t.icon}
                      </div>

                      <h3 className="t-heading">
                        {t.name} — <span className="t-role">{t.role}</span>
                      </h3>

                      <p className="t-body">{t.text}</p>
                    </article>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controles */}
          <button className="carousel-control-prev" type="button" data-bs-target={`#${id}`} data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target={`#${id}`} data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>
    </section>
  );
}
