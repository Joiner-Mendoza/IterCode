import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import '../styles/productcard.css'
import AuthContext from '../context/AuthContext';
import { useNavigate } from "react-router";
// import axios from "axios";
function ProductCard({ id,name, image_url, price, description }) {
  // const [editProdut,setEditProduct] = useState('')
  const navigate = useNavigate('')
  const {user} = React.useContext(AuthContext)
  const userGrops = user?.profile.groups || [];
  
    const goToEdit = () => {
    navigate(`/edit/${id}`);
  };

  return (
    
    <div className="card h-100 shadow-sm">


    {(userGrops.includes('Administrador') ||  userGrops.includes('Supervisor')) && ( 
      <FontAwesomeIcon icon={faPenToSquare} 
      className="icon-edit-product"
      onClick={goToEdit}
      />
    )}    


      <img 
        src={image_url} 
        className="card-img-top img-fluid" 
        alt={name}
        style={{ height: "300px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">{description}</p>
        <h6 className="mt-auto text-success">${price}</h6>
        <button className="btn btn-primary mt-2">Añadir al carrito</button>
      </div>
    </div>
    
    
    
    
  );


  
}

export { ProductCard };
