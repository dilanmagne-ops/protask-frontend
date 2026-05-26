import Navbar from "../components/Navbar/Navbar";
import ProductCard from "../components/ProductCard/ProductCard";
import "./Home.css";

import Link from "next/link";

async function getProducts()
{
    const response = await fetch("https://dummyjson.com/products");

    if (!response.ok)
    {
        throw new Error("Error al obtener productos");
    }

    const data = await response.json();

    return data.products;
}

export default async function Home()
{
    const products = await getProducts();

    return (
        <main className="home-page">

            {/* NAVBAR */}
            <Navbar
                title="ProTask"
                items={[
                    "¿Buscas trabajo freelance?",
                    "¿Necesitas ayuda para tu proyecto?",
                    "Pagos seguros"
                ]}
            />

            {/* HERO */}
            <section className="hero-section">

                <h1 className="hero-title">
                    Bienvenido a ProTask
                </h1>

                <p className="hero-subtitle">
                    Conecta freelancers y clientes
                    de forma segura y profesional.
                </p>

                <div className="buttons-container">

                    <Link href="/login">
                        <button className="login-home-button">
                            Iniciar Sesion
                        </button>
                    </Link>

                    <Link href="/register">
                        <button className="register-home-button">
                            Registrarse
                        </button>
                    </Link>
                </div>
            </section>
        </main>
    );
}