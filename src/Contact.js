
import React, {useRef, useEffect, useState} from "react";

const Contact = ({}) =>{
    const [email,setEmail]= useState('');
    const [subject,setSubject] = useState('');


    useEffect(() =>{
        const map = new google.maps.Map(el.current,{
          center:{ lat: 40.749933, lng:-73.98633 },
          zoom: 13,
          mapTypeControl: false,
        });
    },[]);


    const el = useRef();

    const fake =()=>{
        setEmail('');
        setSubject('');
    }

    return(
        <div>
            <div>
                <h3>Contact Us</h3>
                <form onSubmit={fake}>
                    <input
                    placeholder=" your email"
                    value={email}
                    type="email"
                    onChange={ ev => setEmail(ev.target.value)}
                    />

                    <textarea rows={8} cols={40} 
                    placeholder="add coments or what you'd like to sell "
                    value={subject}
                    onChange={ ev => setSubject(ev.target.value)}
                    />
                    

                    <button id= 'send-button' disabled={!email || !subject}>SEND</button>
                </form>
            </div>
         <div  className = 'map' ref={ el }></div>
         </div>
        
    )
};

export default Contact;