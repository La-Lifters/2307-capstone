import React, {useRef, useEffect} from "react";

const Contact = ({}) =>{
    useEffect(() =>{
        const map = new google.maps.Map(el.current,{
          center:{ lat: 40.749933, lng:-73.98633 },
          zoom: 13,
          mapTypeControl: false,
        });
    },[]);


    const el = useRef();
    
    return(
        <div  className = 'map' ref={ el }></div>
        
    )
};

export default Contact;