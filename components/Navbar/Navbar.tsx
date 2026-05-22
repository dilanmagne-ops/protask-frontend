import "./Navbar.css";

type NavbarProps = {
  title: string;
  items: string[];
};

export default function Navbar({
  title,
  items,
}: NavbarProps) {
  return (
    <nav className="navbar">
      <h1>{title}</h1>

      <ul className="nav-links">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </nav>
  );
}