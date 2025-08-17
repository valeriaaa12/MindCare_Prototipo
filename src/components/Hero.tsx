import FeatureCard from "./FeatureCard";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Hero() {
  return (
    <section className="py-5">
      <div className="container">
        <div className="card border-0 shadow soft-card">
          <div className="card-body p-4 p-lg-5">
            <div className="row align-items-center g-4">
              <div className="col-lg-7">
                <h1 className="display-6 fw-bold mb-3 text-mindcare" >¿Qué es MindCare?</h1>
                <p
                  className="lead lh-base text-justify text-mindcare"
                >
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
                    src="/images/therapy.jpg"
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
              icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="#5a2ea6"
                viewBox="0 0 16 16"
                aria-label="Asistencia emocional 24/7"
              >
                <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135"/>
                <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/>
              </svg>
              }
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
              icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="#5a2ea6"
                viewBox="0 0 16 16"
                aria-label="Mejora continua de tu bienestar"
              >
                 <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"/>
              </svg>
              }
              title="Mejora continua de tu bienestar"
              text="Herramientas interactivas para monitorear y fortalecer tu salud mental."
            />
            </div>
        </div>
      </div>
    </section>
  );
}
