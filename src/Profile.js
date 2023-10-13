import React from "react";
import Link from 'react-router-dom';

const Profile = ({auth, bookmarks})=>{
    return(
        <div>
            <h2>{auth.username}</h2><br/>
            <hr/>
            <h4>Bookmarked Items</h4>
            <ul>
                {
                    bookmarks.map(bookmark =>{
                        return(
                            <li key = { bookmark.id }>
                             { bookmark.product_name}
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
};

export default Profile;