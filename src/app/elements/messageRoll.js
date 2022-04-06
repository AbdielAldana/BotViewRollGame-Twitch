import React, { useState, useEffect} from 'react';
import clsx from "clsx";

// ==== IMPORT CSS ====
import "./assets/assets.css"

function MessageRoll(props) {
    const [message, setMessage] = useState(false)


    useEffect(() => {
        setMessage(props.showRollMessage);
    }, [props.showRollMessage])

    useEffect(()=>{
        // if(message !== false){
        //     const timer = setTimeout(() => {setMessage(false)}, 45000);
        //     return () => clearTimeout(timer);
        // }
    }, [message, setMessage])

    return(
        <div style={{position: "absolute", height:"100vh", width:"100vw"}}>
            <div className={clsx("msgRollBox", message ? "txt2" : "noTxt")} >
                {/* <h2>{props.showMsgRoll} */}
                {/* </h2> */}
                {message &&
                    <div className="contentMSG" style={{width: "100%"}}>
                        <div style={{marginTop: "5px"}}>
                            <h4>{message.data.message}</h4>
                        </div>
                        <div className="msgRollUserClock">
                            <h1>{message.data.userstate.username}   |   {message.hora}</h1>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
export default MessageRoll;