import React from "react";
import { useParams } from "react-router-dom";


const Product = ({ products, auth, createBookmark }) => {
    const {id} = useParams();

    const product = products.find((pro)=>{
        return pro.id === id
    });  

    if(!product){
        return(
            <h1>loading</h1>
        )
    }
    return(
      <div>
        <h3>{product.name}</h3>
        <hr/>
        <p>
            Product description:<br/>
            {product.description}
        </p>
        <hr/>
        <button id="buy_button">BUY</button> <button id="bookmark_button" onClick={ () =>{ createBookmark({product, auth })}}>BOOKMARK</button>
       
      </div>
    )

};

export default Product;