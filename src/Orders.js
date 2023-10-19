import React from 'react';

const Orders = ({ orders, products, lineItems })=> {
  return (
    <div  id='orders-page'>
      <h2>Orders</h2>
      <ul>
        {
          orders.filter(order => !order.is_cart).map( order => {
            const orderLineItems = lineItems.filter(lineItem => lineItem.order_id === order.id);

            const orderTotal = orderLineItems.reduce((total, lineItem) => {
              const product = products.find(product => product.id === lineItem.product_id);
              if (product) {
                return total + product.price * lineItem.quantity;
              }
              return total;
            }, 0);
            return (
              <li key={ order.id }>
                (Order total: ${ orderTotal.toLocaleString('en-US') }, {new Date(order.created_at).toLocaleString() })
                
                <ul>
                  {
                    orderLineItems.map( lineItem => {
                      const product = products.find(product => product.id === lineItem.product_id);
                      return (
                        <div>
                        <li key={lineItem.id}>
                          {product.image ? <img src={product.image}/>:null}
                        </li>
                        <li key={ lineItem.id }>
                          { product ? product.name: '' }
                          { lineItem ? lineItem.quantity : ''}
                        </li>
                        </div>
                      );
                    })
                  }
                </ul>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default Orders;