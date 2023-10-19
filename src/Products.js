import React from 'react';
import ReactPaginate from 'react-paginate';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductImageEditor from './ImageEditor';
  
const Products = ({ products, cartItems, createLineItem, updateLineItem, auth, updateProduct})=> {
  const navigate = useNavigate();
  const { term } = useParams();

  // const handlePageClick =(data)=>{

  // };

  return (
    <div>
      <h2 id='productsLogo'>Products</h2>
      <input id='searchbar'
      placeholder='search for products' 
      value={ term || '' } 
      onChange={ ev => navigate(ev.target.value ? `/products/search/${ev.target.value}` : '/products')} />
      <ul id = 'products_list'>
        {
          products
          .filter(product => !term || product.name.indexOf(term) !== -1)
          // .slice(0,6)
          .map( product => {
            const cartItem = cartItems.find(lineItem => lineItem.product_id === product.id);
            return (
              <li id = 'products_li' key={ product.id }>
                { product.image ? <img src = {product.image}/> : null }
                <Link id = 'product_link' to = {`/product/${product.id}`}>{ product.name }</Link>
                {' '} {'$' + (product.price).toLocaleString("en-US") } {' '}
                {/* <p>{ product.description }</p> */}
                {
                  auth.id ? (
                    cartItem ? <button id ='addAnother' onClick={ ()=> updateLineItem(cartItem)}>Add Another</button>: <button id='add_button' onClick={ ()=> createLineItem(product)}>Add</button>
                  ): null 
                }
                {
                  auth.is_admin ? (
                    <div className='products_admin'>
                    <Link to={`/products/${product.id}/edit`} >Edit</Link>
                    <ProductImageEditor product = { product } updateProduct = { updateProduct }/>
                    </div>
                  ): null
                }
              </li>
            );
          })
        }
      </ul>
      {/* <ReactPaginate
      previousLabel={'previous'}
      nextLabel={'next'}
      breakLabel={'...'}
      pageCount={10}
      marginPagesDisplayed={1}
      onPageChange={handlePageClick}
      containerClassName={'pagination justify-content-center'}
      pageClassName={'page-item'}
      pageLinkClassName={'page-link'}
      previousClassName={'page-item'}
      previousLinkClassName={'page-link'}
      nextClassName={'page-item'}
      nextLinkClassName={'page-link'}
      breakClassName={'page-item'}
      breakLinkClassName={'page-link'}
      activeClassName={'active'}
      /> */}
      
    </div>
  );
};

export default Products;
