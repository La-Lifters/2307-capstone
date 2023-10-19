import React, {useRef, useEffect} from "react";

const Contact = ({ addresses, createAddress }) =>{
    useEffect(() =>{
        const map = new google.maps.Map(el.current,{
          center:{ lat: 40.749933, lng:-73.98633 },
          zoom: 13,
          mapTypeControl: false,
        });
    },[]);

    const el = useRef();
    
    return(
        <div>
            <div  className = 'map' ref={ el } ></div>
            <div>
                <h2>Addresses</h2>
                <input ref={ el } />
                <ul>
                    {
                        addresses.map( address => {
                            return (
                                <li key={ address.id }>
                                    { address.data.formatted_address }
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        </div>
        
    )
};
  
export default Contact;