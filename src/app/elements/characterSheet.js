import React, { useState, useEffect} from 'react'

// ==== IMPORT CSS ====
import "./assets/assets.css"

// ==== IMPORT IMAGES ====
import Header from "./assets/img/header.png"
import Fuerza from "./assets/img/fuerza.png"
import Destreza from "./assets/img/destreza.png"
import Constitucion from "./assets/img/constitucion.png"
import Inteligencia from "./assets/img/inteligencia.png"
import Sabiduria from "./assets/img/sabiduria.png"
import Carisma from "./assets/img/carisma.png"

import Vel from "./assets/img/vel.png"
import Ac from "./assets/img/ac.png"
import Ini from "./assets/img/ini.png"

import Spe from "./assets/img/spells.png"
import Ski from "./assets/img/skills.png"


function CharacterSheet(props) {

    // console.log(props.dataGame);
    // console.log(props.Skills);
    return(
        <div style={{position: "absolute", height: "100vh", width: "100vw"}}>
            {/* Stats */}
            <div className="statsBox">
                <div className="statBox">
                    <h2>{props.dataGame[2].base}</h2>
                    <img src={Fuerza}></img>
                    <h4>{props.dataGame[2].mod}</h4>
                </div>
                <div className="statBox">
                    <h2>{props.dataGame[3].base}</h2>
                    <img src={Destreza}></img>
                    <h4>{props.dataGame[3].mod}</h4>
                </div>
                <div className="statBox">
                    <h2>{props.dataGame[4].base}</h2>
                    <img src={Constitucion}></img>
                    <h4>{props.dataGame[4].mod}</h4>
                </div>
                <div className="statBox">
                    <h2>{props.dataGame[5].base}</h2>
                    <img src={Inteligencia}></img>
                    <h4>{props.dataGame[5].mod}</h4>
                </div>
                <div className="statBox">
                    <h2>{props.dataGame[6].base}</h2>
                    <img src={Sabiduria}></img>
                    <h4>{props.dataGame[6].mod}</h4>
                </div>
                <div className="statBox">
                    <h2>{props.dataGame[7].base}</h2>
                    <img src={Carisma}></img>
                    <h4>{props.dataGame[7].mod}</h4>
                </div>
            </div>

            {/* Stats 2 */}
            <div className="statsBox2">
                <div className="statBox2">
                    <img src={Vel}></img>
                    <h2>{(parseInt(props.dataGame[10].value))}</h2>
                </div>
                <div className="statBox2">
                    <img src={Ac}></img>
                    <h2>{props.dataGame[8].value}</h2>
                </div>
                <div className="statBox2">
                    <img src={Ini}></img>
                    <h2>{+props.dataGame[9].value + parseInt(props.dataGame[3].mod)}</h2>
                </div>

            </div>


            
            {/* Vida */}
            <div className="lineliveTotal livePosition1">
                <div className="liveTex">
                    <h1>{props.dataGame[0].actual + " | " + props.dataGame[0].base}</h1>
                </div>
                <div className="liveTotal">
                    <div className="live" style={{"--bottom":Math.round((props.dataGame[0].actual * 100) / props.dataGame[0].base)+"%", "background":"#CD5738"}}>
                    </div>
                </div>
            </div>

            {props.dataGame[0].falsa > 0 &&
                <div className="lineliveTotal livePosition2">
                    <div className="liveTex">
                        <h1>{Math.round((props.dataGame[0].falsa * 100) / props.dataGame[0].base)}%</h1>
                    </div>
                    <div className="liveTotal">
                        <div className="live" style={{"--bottom":Math.round((props.dataGame[0].falsa * 100) / props.dataGame[0].base)+"%", "background":"#A05BA0"}}>
                        </div>
                    </div>
                </div>
            }


        </div>
    );
}

export default CharacterSheet;