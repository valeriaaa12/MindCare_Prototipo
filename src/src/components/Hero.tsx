
import FeatureCard from "./FeatureCard";

export default function Hero() {
  return (
    <section className="py-5">
      <div className="container">
        <div className="card border-0 shadow soft-card">
          <div className="card-body p-4 p-lg-5">
            <div className="row align-items-center g-4">
              <div className="col-lg-7">
                <h1 className="display-6 fw-bold text-dark mb-3">¿Qué es MindCare?</h1>
                <p className="lead text-body-secondary lh-base">
                  MindCare es una innovadora aplicación diseñada para brindar apoyo psicológico de
                  manera accesible y personalizada. A través de un chatbot impulsado por inteligencia
                  artificial, ofrecemos acompañamiento emocional 24/7, orientación en momentos difíciles
                  y herramientas para el bienestar mental. Además, conectamos a los usuarios con psicólogos
                  profesionales para sesiones en línea, asegurando una atención integral y confiable.
                  MindCare es tu espacio seguro para sentirte escuchado, comprendido y apoyado.
                </p>
              </div>
              <div className="col-lg-5">
                <div className="hero-illustration mx-auto">
                  <img
                    className="img-fluid"
                    src="/illustration.png"
                    alt="Ilustración consulta psicológica"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjetas */}
        <div className="row g-4 mt-4">
          <div className="col-12 col-md-6 col-lg-4">
            <FeatureCard
              icon="bi-brain"
              title="Asistencia emocional 24/7"
              text="Accede a apoyo inmediato en cualquier momento gracias a nuestro chatbot inteligente."
            />
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <FeatureCard
              icon="bi-person-badge"
              title="Atención profesional personalizada"
              text="Conecta con psicólogos certificados para sesiones online seguras y confidenciales."
            />
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <FeatureCard
              icon="bi-emoji-heart-eyes"
              title="Mejora continua de tu bienestar"
              text="Herramientas interactivas para monitorear y fortalecer tu salud mental."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
