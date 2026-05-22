import "./ProductCard.css";

type ProductCardProps = {
  title: string;
  description: string;
  price: number;
  image: string;
};

export default function ProductCard({
  title,
  description,
  price,
  image,
}: ProductCardProps) {
  return (
    <div className="card">
      <img src={image} alt={title} />

      <h2>{title}</h2>

      <p>{description}</p>

      <h3>${price}</h3>
    </div>
  );
}