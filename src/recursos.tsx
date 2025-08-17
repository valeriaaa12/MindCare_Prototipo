

/** Tipos de recurso */
type Book = {
  id: string;
  type: "book";
  title: string;
  author?: string;          // ← rellena aquí
  description?: string;     // ← rellena aquí
  cover?: string;           // ← /images/resources/mi-libro.png
  link?: string;            // ← enlace a tienda/pdf/artículo (opcional)
};

type Video = {
  id: string;
  type: "video";
  title: string;
  description?: string;     // ← rellena aquí
  youtubeId: string;        // ← SOLO el ID de YouTube (ej: "dQw4w9WgXcQ")
};

type Resource = Book | Video;

/** 5 EJEMPLOS (cámbialos libremente) */
const RESOURCES: Resource[] = [
  {
    id: "b1",
    type: "book",
    title: "La mente dividida",
    author: "Elyn R. Saks",
    description:
      "A partir de una memoria personal, la autora relata su experiencia sobre cómo es la vida de alguien que padece esquizofrenia.",
    cover: "/images/book1.jpg", // deja tu imagen en public/images/resources/
    link: "#",
  },
  {
    id: "v1",
    type: "video",
    title: "5 estrategias para mejorar tu salud mental hoy",
    description: "¿Te sientes abrumado? Estas cinco sencillas estrategias pueden ayudarte a mejorar tu bienestar mental de inmediato.",
    youtubeId: "vGgDIPMyP2g?si=kSSdgr7zbw4BXNGY", // ⚠️ Reemplaza por el ID real
  },
  {
    id: "b2",
    type: "book",
    title: "La psicología de la autoestima",
    author: "Nathaniel Branden",
    description:
      "El autor es un psicoterapeuta canadiense, especialista en psicología de la autoestima. El libro nos enseña cómo podemos mejorar nuestra autoestima, por qué es tan necesaria en la vida del ser humano y cómo aprender a valorarnos a nosotros mismos. ",
    cover: "/images/book2.jpg",
    link: "#",
  },
  {
    id: "v2",
    type: "video",
    title: "Consejos para el bienestar de la salud mental",
    description: "Aquí encontrará maneras prácticas de lograr una mejor salud mental y un equilibrio en su vida, como practicar la gratitud, conectar con los demás y mantener la salud física.",
    youtubeId: "NQcYZplTXnQ?si=Lpzxp8F6HmDoLr-W", // ⚠️ Reemplaza por el ID real
  },
  {
    id: "b3",
    type: "book",
    title: "La inteligencia emocional",
    author: "Daniel Goleman",
    description:
      "El autor es un psicólogo y periodista científico que explica en el libro cómo podemos desarrollar nuestra inteligencia emocional y mejorar nuestras relaciones y bienestar emocional.",
    cover: "/images/book3.jpg",
    link: "#",
  },
];

function BookCard({ r }: { r: Book }) {
  return (
    <article className="res-card">
      <div className="res-row">
        {/* Portada a la IZQUIERDA */}
        <div className="res-thumb">
          {r.cover ? (
            <img src={r.cover} alt={r.title} />
          ) : (
            <div className="res-thumb-placeholder">📘</div>
          )}
        </div>

        {/* Texto a la DERECHA */}
        <div className="res-main">
          <h3 className="res-title mb-1">{r.title}</h3>
          {r.author && <div className="res-author small mb-2">Autor: {r.author}</div>}
          {r.description && <p className="res-desc mb-2">{r.description}</p>}
          {r.link && (
            <a className="btn btn-mc btn-sm rounded-pill" href={r.link} target="_blank" rel="noreferrer">
              Ver recurso
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
function VideoCard({ r }: { r: Video }) {
  return (
    <article className="res-card">
      <h3 className="res-title mb-1 text-center">{r.title}</h3>
      {r.description && <p className="res-desc mb-1">{r.description}</p>}

      {/* Thumbnail CUADRADO y pequeño */}
      <div className="res-video-thumb res-video-thumb--sm">
        <iframe
          src={`https://www.youtube.com/embed/${r.youtubeId}?rel=0`}
          title={r.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </article>
  );
}



export default function Recursos() {
  return (
    <section className="resources-section py-5">
      <div className="container-xxl">
        <h2 className="h3 fw-bold text-center text-mc mb-4">
          Recursos que te recomendamos
        </h2>

        <div className="row g-4 justify-content-center">
          {RESOURCES.map((r) => {
            // Libros en dos columnas desde lg, videos a ancho completo
            const col = r.type === "video" ? "col-12 col-lg-10" : "col-12 col-md-6 col-xl-5";
            return (
              <div key={r.id} className={`${col} d-flex`}>
                {r.type === "book" ? <BookCard r={r} /> : <VideoCard r={r} />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
