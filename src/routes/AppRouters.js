import React, {Fragment} from 'react';
import {BrowserRouter as Router, Route, Routes, } from "react-router-dom"
// import EnvironmentPage from '../app/pages/game/EnvironmentPage';
import Hud from '../app/pages/Hud';
import HudEdit from '../app/pages/HudEdit';
import NotFound404 from "../app/pages/NotFound404"
// import { useCookies  } from 'react-cookie';
import Cookies from 'universal-cookie';

import dataGame from "../app/rollGame/attr.json"


export default function AppRouters() {
    
    // const [cookies, setCookie, removeCookie] = useCookies();
    
    React.useEffect(()=>{
        const cookies = new Cookies();
        cookies.set("attr", dataGame)
    //     setCookie("attr", dataGame);
    }, [])

    // const [dGame, setDGame] = React.useState(dataGame)

    // React.useEffect(() => {
    //     console.log(dGame[0]);
    // }, [dGame, setDGame])

    return (
        <Router>
            <Fragment>
                <Routes>
                    <Route exact path="/edit" element={<HudEdit />} />
                    <Route exact path="/tab" element={<Hud />} />
                    <Route path="*" element={<NotFound404 />} />
                </Routes>
            </Fragment>
        </Router>
    )
}
