import React, { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import axios from "axios";
function Dashboard() {
  const [ products,setProducts ] = useState([])//estado para almacenar todos los productos
  // carga los productos al inicializar
  useEffect(()=> {
    getProducts();
  },[])
  // Función para traer los datos de los productos desde el backend
  const getProducts = async() => {
        try{
          const response = await axios.get('http://127.0.0.1:8000/api/products/');
          setProducts(response.data)
          console.log('datos de la consulta  para los items:',response.data)
        }catch(err){
          console.error('error al traer los items del bakend:',err)
        }
    };

  return (
    <div className="container mt-4 text-center">
      <div className="row row-cols-1 row-cols-md-3 g-4">

        {products.length === 0 ? (
          <p>Cargando productos...</p>
        ) : (
          products.map((product) => (
            <div className="col" key={product.id}>
              <ProductCard
                id={product.id}
                name={product.name}
                image_url={product.image_url}
                price={parseFloat(product.price).toFixed(2)}
                description={product.description}
              />
            </div>
          ))
        )}
    
      </div>
      
    </div>
  
  );
}

export { Dashboard };