import React from 'react'
// import { useCookies  } from 'react-cookie';
import Cookies from 'universal-cookie';

export default function HudEdit(props) {
    // const [cookies, setCookie, removeCookie] = useCookies();
    const cookies = new Cookies();


    const cambiar = () => {
        console.log(document.getElementById("vida").value);

        let tempData = cookies.get("attr")
        tempData[0].actual = parseInt(document.getElementById("vida").value)

        // props.setDGame([...tempData])
        cookies.set("attr", tempData);

    }

    cookies.addChangeListener(
        ()=>{
            console.log(cookies.get("attr")[0])
        }
    )

    return (
        <div>
            <input type="text" id="vida" placeholder={cookies.get("attr")[0].actual}></input>
            <button onClick={cambiar}>Cambiar</button>
        </div>
    )
}
