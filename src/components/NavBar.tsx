type Props = { current: "home" | "chatbot" };

export default function Navbar({ current }: Props) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark mindcare-navbar sticky-top shadow-sm">
      <div className="container">
        {/* Brand */}
        <a className="navbar-brand d-flex align-items-center gap-2" href="#/">
          <span className="logo-badge d-inline-flex align-items-center justify-content-center">
            <img src="/images/logo.png" alt="MindCare Logo" style={{ width: 32, height: 32, objectFit: "contain" }} />
          </span>
          <span className="fw-semibold">MindCare</span>
        </a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mcNav">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mcNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <a className={`nav-link${current === "home" ? " active" : ""}`} href="#/">
                Inicio
              </a>
            </li>

            <li className=  "nav-item">
              {/* IMPORTANTE: ruta con hash, no a un archivo */}
              <a className={`nav-link${current === "chatbot" ? " active" : ""}`} href="#chatbot">
                Mindy
              </a>
            </li>

            <li className="nav-item"><a className="nav-link" href="#">Agenda una cita</a></li>
            <li className="nav-item me-lg-3"><a className="nav-link" href="#">Sobre Nosotros</a></li>

            <li className="nav-item d-flex align-items-center justify-content-center">
              <span className="avatar-circle d-flex align-items-center justify-content-center" title="Profile"
                    style={{ width: 36, height: 36, background: "transparent" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" className="bi bi-person" viewBox="0 0 16 16" style={{ display: "block" }}>
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                </svg>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
