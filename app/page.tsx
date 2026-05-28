import Navbar from "../components/Navbar/Navbar";
import "./Home.css";
import Link from "next/link";

export default function Home()
{
    return (
        <main className="home-page">

            <Navbar
                title="ProTask"
                items={[
                    "Freelancers",
                    "Clientes",
                    "Pagos seguros"
                ]}
            />

            <section className="hero-section">

                <div className="hero-content">

                    <span className="hero-badge">
                        Plataforma freelance segura
                    </span>

                    <h1 className="hero-title">
                        Conecta con freelancers y clientes de forma profesional
                    </h1>

                    <p className="hero-subtitle">
                        Publica proyectos, encuentra talento y trabaja con mayor confianza usando ProTask.
                    </p>

                    <div className="buttons-container">

                        <Link href="/login">
                            <button className="login-home-button">
                                Iniciar Sesión
                            </button>
                        </Link>

                        <Link href="/register">
                            <button className="register-home-button">
                                Crear Cuenta
                            </button>
                        </Link>

                    </div>

                </div>

                <div className="hero-card">

                    <h2>
                        ¿Qué puedes hacer?
                    </h2>

                    <div className="feature-item">
                        <span>01</span>
                        <p>
                            Publicar proyectos con requisitos claros.
                        </p>
                    </div>

                    <div className="feature-item">
                        <span>02</span>
                        <p>
                            Buscar freelancers según habilidades.
                        </p>
                    </div>

                    <div className="feature-item">
                        <span>03</span>
                        <p>
                            Trabajar con pagos más seguros.
                        </p>
                    </div>

                </div>

            </section>

        </main>
    );
}