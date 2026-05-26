import Navbar from "../components/Navbar/Navbar";
import ProductCard from "../components/ProductCard/ProductCard";
import "./Home.css";
// CONEXION DE BOTONES PARA LLEVAR A OTRAS PAGINAS
import Link from "next/link";

async function getProducts() {
  const response = await fetch("https://dummyjson.com/products");
  if (!response.ok) {
  throw new Error("Error al obtener productos");
  }
  const data = await response.json();
  return data.products;
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div>
      <Navbar
      title="MiTienda"
      items={["Inicio", "Productos", "Contacto"]}
      />
      {/* CREAR BARRITA DE ENTRADA EN LA PAGINA WEB */}
      <Navbar
       title="Admin Panel"
       items={["Usuarios", "Ventas"]}
      />
      <div className="buttons-container">
      {/* CREAR BOTON DE INICIAR SESION */}
      <Link href="/login">
          <button className="login-home-button">
            Iniciar Sesión
          </button>
        </Link>
        {/* CREAR BOTON DE REGISTRO*/}
        <Link href="/register">
          <button className="register-home-button">
            Registrarse
          </button>
        </Link>
     </div>
      <div className="products-container">
        {products.slice(0, 8).map((product: any) => (
          <ProductCard
            key={product.id}
            title={product.title}
            description={product.description}
            price={product.price}
            image={product.thumbnail}
          />
        ))}
      </div>
    </div>
  );
}