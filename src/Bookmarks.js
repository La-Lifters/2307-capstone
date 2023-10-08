import React from "react";

const Bookmarks = ({ bookmarks }) =>{
    return (
        <div>
          <h2>Bookmarks</h2>
          <ul>
            {
                bookmarks.map((bookmark) =>{
                    return(
                        <li key={ bookmark.id }>
                            { bookmark.product_name }
                        </li>
                    )
                })
            }
          </ul>
        </div>
      );


};

export default Bookmarks;