import React from "react";
import Footer from "../../components/Navigation/Footer";
export const getStaticProps = async () => {
  const response = await fetch("http://localhost:3000/products");
  const data = await response.json();
  return {
    props: { products: data },
  };
};
const Blouses = ({ products }) => {
  return (
    <section className="collection">
      <div className="container">
        блузки
        {/* {products.filter(product =>product.category==='Blouse')} */}
      </div>
      <Footer></Footer>
    </section>
  );
};

export default Blouses;