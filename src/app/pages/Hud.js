// ==== IMPORT REACT JS ====
import React, { useState, useEffect} from 'react'
// import { useCookies } from 'react-cookie';
// import Cookies from 'universal-cookie';

// ==== IMPORT ROLL DICE 3D ====
import DisplayResults from "@3d-dice/fui/src/displayResults"; // fui index exports are messed up -> going to src
import DiceParser from "@3d-dice/fdp";
import { Dice } from "../components/diceBox";



// ==== IMPORT TMI JS ====
import tmi from 'tmi.js'
import optionsTMI from "../config/tmi.json"

// ==== IMPORT DATA GAME ====
import dataGame from "../rollGame/attr.json"
import Skills from "../rollGame/skills.json"
import Spells from "../rollGame/spells.json"

// ==== IMPORT ELEMENTS ====
import CharacterSheet from "../elements/characterSheet"
import MessageRoll from "../elements/messageRoll"

// ==== FUNCTIONS ROLL DICE 3D ====
const DRP = new DiceParser();

const DiceResults = new DisplayResults("#dice-box");

Dice.init().then(() => {
  document.addEventListener("mousedown", () => {
    const diceBoxCanvas = document.getElementById("dice-canvas");
    if (window.getComputedStyle(diceBoxCanvas).display !== "none") {
      Dice.hide().clear();
      DiceResults.clear();
    }
  });
});


// ==== FUNCTIONS TMI JS ====
const client = new tmi.client(optionsTMI);

client.connect();

client.on("connected", (address, port) => {
	client.action(
		"YOUR_CHANNEL",
		"abdyalRollon [Perfil Actualizado] abdyalRollon"
    )
});

// Componet ===================================================================================
function Hud(props) {


    // ==== STATES ====
    const [dataRollDice, setDataRollDice] = useState({})
    // const [dataGame, setDataGame] = useState(dataGame)

            // ==== FUNCTIONS ROLL DICE 3D ====
    // Lanza los dados
    const rollDice = (notation, userData, element) => {
        Dice.hide().clear();

        if (typeof notation === "string"){
            Dice.show().roll(notation, {theme:userData.userstate.color});
        }else if( typeof notation === "object"){
            Dice.show().roll(notation[0], {theme:"#eaeaea"});
            Dice.show().add(notation[1], {theme:userData.userstate.color, newStartPoint:false});
        }

        if(element){
            setDataRollDice({...userData, element})
        }else {
            setDataRollDice(userData)
        }

        if(!saveMessageDataList){
            let msgData = messageDataList
            msgData.shift()
            setMessageDataList([...msgData])
        }
    };

    // Acciones para despues de los dados lanzados
    Dice.onRollComplete = (results) => {
        endRoll()

        if(dataRollDice.type === "stats"){ //STATS =============================
            if(results[0].value > 10){
                resp(`abdyalRollon ${dataRollDice.data.name}: ${results[0].value} abdyalRollon ${dataRollDice.userstate.username}  `)
            }else if(results[0].value < 11){
                resp(`abdyalRolloff ${dataRollDice.data.name}: ${results[0].value} abdyalRolloff ${dataRollDice.userstate.username}  `)
            }
        }else if(dataRollDice.type === "skill"){ //SKILLS =============================
            if(results[0].value > 10){
                resp(`abdyalRollon ${dataRollDice.element.name}: ${results[0].value} abdyalRollon ${dataRollDice.userstate.username}  `)
            }else if(results[0].value < 11){
                resp(`abdyalRolloff ${dataRollDice.element.name}: ${results[0].value} abdyalRolloff ${dataRollDice.userstate.username}  `)
            }
        }else if(dataRollDice.type === "spell"){//SPELLS =============================
            if(results.length > 1){ // SI Daño
                if(results[0].value >= dataRollDice.element.saving_throw_number){
                    console.log("no hizo daño");
                    resp(`abdyalRolloff NPC ${dataRollDice.element.saving_throw_stat} Save: ${results[0].value} > ${dataRollDice.element.name} DC: ${dataRollDice.element.saving_throw_number} | FALLODO abdyalRolloff ${dataRollDice.userstate.username}`)
                }else if (results[0].value < dataRollDice.element.saving_throw_number){
                    resp(`abdyalRollon NPC ${dataRollDice.element.saving_throw_stat} Save: ${results[0].value} < ${dataRollDice.element.name} DC: ${dataRollDice.element.saving_throw_number} | ACTIVADO | Daño = ${results[1].value} abdyalRollon ${dataRollDice.userstate.username}`)
                }
            }else{ // NO Daño
                if(results[0].value >= dataRollDice.element.saving_throw_number){
                    resp(`abdyalRolloff ${dataRollDice.element.name} DC: ${dataRollDice.element.saving_throw_number} < NPC ${dataRollDice.element.saving_throw_stat} Save: ${results[0].value} | FALLODO abdyalRolloff  ${dataRollDice.userstate.username}`)
                } else{
                    resp(`abdyalRollon  ${dataRollDice.element.name} DC: ${dataRollDice.element.saving_throw_number} > NPC ${dataRollDice.element.saving_throw_stat} Save: ${results[0].value} | ACTIVADO abdyalRollon  ${dataRollDice.userstate.username}`)
                }
            }
            console.log(dataRollDice);
            console.log(results);
        }
    };

    // Termina el proceso de lanzar dados y manda a llamar la funcion para continuar la cola de solicitudes
    const endRoll = () => {
        setTimeout(()=>{
            DiceResults.clear();
        }, 5000);
        setTimeout(()=>{
            continueList()
        }, 7000);
        setTimeout(()=>{
            Dice.hide().clear();
        }, 60000);
    }

    // ==== FUNCTIONS TMI JS ====
    // Manda mensaje a Twitch
    const resp = (message) => {
		client.action(
			"abdyaldana",
			message
		);
    }

    const [messageData, setMessageData] = useState([])
    const [messageDataList, setMessageDataList] = useState([])
    const [saveMessageDataList, setSaveMessageDataList] = React.useState(true)

    // Accion al recivir un mensaje
    useEffect(() => {
        client.on("chat", (from, userstate, message, self) => {
            if (self) return;
            // console.log(userstate["custom-reward-id"])

            // rollDice(message, msgData);

            if (message === "!psj"){
                resp(`${userstate.username} -> jokuna.abdielaldana.com`)
            }else if(message === "!skills"){//Lista Skills
                var list = ""
                Skills.forEach(element => {
                    list = list + " " + element.id + " - " + element.name + "(" + element.value + ")  |  "
                });
                resp(list)
            }else if(message === "!spells"){//Lista Skills
                var list = ""
                Spells.forEach(element => {
                    list = list + " " + element.id + " - " + element.name + " | "
                })
                resp(list)
                resp("Puedes ver la descripcion aqui ->  https://5e.tools/spells.html")
            }else if(userstate["custom-reward-id"] === "ff7d2e5b-6bb1-4dca-ac31-6daee87a6d27"){//Mensaje en pantalla
                setTempRollMessage([{from: from, userstate: userstate, message: message, self: self} ])
            }else if(userstate["custom-reward-id"] === "9add5498-d016-4c89-bfaf-6411df12a4dd"){//Skills
                var msg = parseInt(message.split("-")[0])
                if(msg > 0 && msg <  19){
                    setMessageData([{from: from, userstate: userstate, message: message, self: self, type: "skill"}])
                } else{
                    resp(userstate.username + " Ese Id no existe.")
                }
            }else if(userstate["custom-reward-id"] === "515f8aac-7eb7-47b2-a7ea-40ccb8f92e8c"){//Spells
                var msg = parseInt(message.split("-")[0])
                if(msg > 0 && msg <  8){
                    setMessageData([{from: from, userstate: userstate, message: message, self: self, type: "spell"}])
                } else{
                    resp(userstate.username + " Ese Id no existe.")
                }
            }else if(userstate["custom-reward-id"]) { // Puntos Del Canal
                setMessageData([{from: from, userstate: userstate, message: message, self: self, type: "stats"}])
            }
        });
    }, [])

    // =========================================================================
    // Recompenzas Roll Mensaje
    // =========================================================================
    const [tempRollMessage, setTempRollMessage] = useState([])
    const [rollMessageList, setRollMessageList] = useState([])
    const [saveRollMessage, setSaveRollMessage] = useState(true)

    const [showRollMessage, setShowRollMessage] = useState("")

    useEffect(() => {
        if(tempRollMessage.length > 0){
            var hoy = new Date();

            var hour = hoy.getHours();
            var mins = hoy.getMinutes();
            var seconds = hoy.getSeconds();

            var hora = "";

            if(mins < 10){
                if(seconds < 10){
                    hora = hour + ":0" + mins + ":0" + seconds
                }else{
                    hora = hour + ":0" + mins + ":" + seconds
                }
                }else {
                if(seconds < 10){
                    hora = hour + ":" + mins + ":0" + seconds
                }else{
                    hora = hour + ":" + mins + ":" + seconds
                }
            }

            
            // setShowRollMessage(tempRollMessage[0] + " - " + hora)
            setShowRollMessage({data: tempRollMessage[0], hora: hora})
        }
    }, [tempRollMessage, setTempRollMessage])


    // =========================================================================
    // Recompenzas Stats
    // =========================================================================
    // Procesa la informacion del mensaje recivido
    useEffect(() => {
        if(messageData.length > 0 ){
            dataGame.forEach(data => {
                if(messageData[0].userstate["custom-reward-id"] === data.key && saveMessageDataList){
                    setSaveMessageDataList(false)
                    processMessageDataList({...messageData[0], data, action: saveMessageDataList})
                }
                if(messageData[0].userstate["custom-reward-id"] === data.key && !saveMessageDataList){
                    processMessageDataList({...messageData[0], data, action: saveMessageDataList})
                }
            });
        }
    }, [messageData, setMessageData])


    // Procesa el mensaje si es una Recompenza
    const processMessageDataList = (msgData) => {
        let array = messageDataList

        if(!msgData.action && !saveMessageDataList){
            array.push(msgData)
            setMessageDataList([...array])
        } else {
            if(msgData.type === "stats"){
                var diceR = msgData.data.dado
                var modR = msgData.data.mod === "+0" ? "" :  msgData.data.mod + ""
                var finalRol = diceR + modR
                rollDice(finalRol, msgData, false);
            }else if(msgData.type === "skill") {
                var tempElement
                var tempData
                var finalData
                Skills.forEach(element => {
                    if(element.id ===  parseInt(msgData.message.split("-")[0]) ){
                        tempElement = element
                        dataGame.forEach(element2 => {
                            if(element.key === element2.key){
                                finalData = element2.dado
                                if(element.pb){
                                    tempData = "+"+(dataGame[11].value + parseInt(element2.mod))
                                }else {
                                    tempData = element2.mod
                                }
                            }
                        })

                    }
                })
                finalData = finalData + tempData
                rollDice(finalData, msgData, tempElement);
            }else if(msgData.type === "spell") {
                Spells.forEach((element)=>{
                    if(element.id ===  parseInt(msgData.message.split("-")[0]) ){
                        if(element.saving_throw){
                            rollDice(element.dice, msgData, element);
                        }else{
                            resp(`abdyalRollon ${element.name} ACTIVADO abdyalRollon ${msgData.userstate.username}`)
                            let msgData2 = messageDataList
                            msgData2.shift()
                            setMessageDataList([...msgData2])
                            continueList()
                        }
                    }
                })
            }
        }
    }

    // Continua con el Array(cola) que se genero
    const continueList = () => {
        let msgData = messageDataList
        if(msgData.length > 0){
            if(msgData[0].type === "stats"){
                var diceR = msgData[0].data.dado
                var modR = msgData[0].data.mod === "+0" ? "" :  msgData[0].data.mod + ""
                var finalRol = diceR + modR
                rollDice(finalRol, msgData[0], false);
            }else if(msgData[0].type === "skill") {
                var tempElement
                var tempData
                var finalData
                Skills.forEach(element => {
                    if(element.id ===  parseInt(msgData[0].message.split("-")[0]) ){
                        tempElement = element
                        dataGame.forEach(element2 => {
                            if(element.key === element2.key){
                                finalData = element2.dado
                                if(element.pb){
                                    tempData = "+"+(dataGame[11].value + parseInt(element2.mod))
                                }else {
                                    tempData = element2.mod
                                }
                            }
                        })

                    }
                })
                finalData = finalData + tempData
                rollDice(finalData, msgData[0], tempElement);
            }else if(msgData[0].type === "spell") {
                Spells.forEach((element)=>{
                    if(element.id ===  parseInt(msgData[0].message.split("-")[0]) ){
                        if(element.saving_throw){
                            rollDice(element.dice, msgData[0], element);
                        }else{
                            resp(`abdyalRollon ${element.name} ACTIVADO abdyalRollon ${msgData[0].userstate.username}`)
                            if(!saveMessageDataList){
                                let msgData2 = messageDataList
                                msgData2.shift()
                                setMessageDataList([...msgData2])
                                continueList()
                            }
                        }
                    }
                })
            }

        }else{
            setSaveMessageDataList(true)
        }

    }

    const [time, setTime] = useState("")



    return(

        <div className="App">

            <div style={{position: "absolute", left: "450px", top: "20px", fontFamily:"Arial, Helvetica, sans-serif !important"}}>
                <h3>{time}</h3>
            </div>
            {/* <div className="messageDice">

            </div> */}
            <CharacterSheet
                dataGame={dataGame}
                Skills={Skills}
                // dataListRoll= {messageDataList}
            ></CharacterSheet>

            <MessageRoll
                showRollMessage={showRollMessage}
                resp={resp}
            ></MessageRoll>

            {/* !!!!!!!messageDataList */}
            {/* {props.dataListRoll &&
            props.dataListRoll.map((e, i)=>{
                return(
                    <div key={i}>
                        <h2>{e.userstate.username}</h2>
                        <h2>{e.message}</h2>
                        <h2>{e.data.name}</h2>
                        <hr></hr>
                    </div>
                )
            })} */}
        </div>

    )
}

export default Hud;