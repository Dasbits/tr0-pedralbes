let dades = {};
let respostesBack = [];
let TEMPS;
let tempsSec;
let tempsMin;

//DEMANO DADES
fetch('../backEnd/preguntesAleatories.php')
  .then(response => response.json())
  .then(datos => crearPartida(datos));

document.getElementById("iniciar").addEventListener("click", function () {
  document.getElementById("temps").innerHTML = "0:00";
  document.getElementById("titlePreg").className = "oculta";
  document.getElementById("iniciar").classList.add("oculta");
  document.getElementById("zoneIniciar").classList.add("oculta");
  document.getElementById("partida").classList.remove("oculta");
  document.getElementById("partida").classList.add("activa");
  document.getElementById("temps").classList.remove("oculta");
  document.getElementById("temps").classList.add("activa");
  document.getElementById("tornar_inici").className = "activa";

  tempsSec = 0;
  tempsMin = 0;

  const element = document.getElementById("temps");
  TEMPS = setInterval(function() {
    tempsSec++;
    if(tempsSec > 59){
      tempsMin++;
      tempsSec = 0;
    }
    element.innerHTML = tempsMin + ":" + (tempsSec<10?"0"+tempsSec:tempsSec);
    
  }, 1000);
})



function crearPartida(preguntesRand) {

  let htmlStr = '';

  for (let i = 0; i < preguntesRand.length; i++) {
    const element = preguntesRand[i];
    htmlStr += `<div id="${i}" class="${i==0?'activa':'oculta'}" >`;
    htmlStr += `<img src="${element.imatge}" alt="semaforo_rojo"> <div id="enunciat">${element.pregunta}</div> `;

    htmlStr += `<div id="respostes">`;
    for (let posResp = 0; posResp < 4; posResp++) {
      
      htmlStr += `<button
                  type="button" 
                  id="pregunta${i}resposta${posResp}" 
                  name="pregunta${i}" 
                  value="${element.respostes[posResp]}"
                  onclick ="guardaResposta(${i},${posResp})" 
                  >
                  ${element.respostes[posResp]}
                  </button>`;
    }
    htmlStr += `</div>`
    htmlStr += `<div id="buttonsEnrereEndevat"><button type="button" name="moure" value="-1" onclick="canviarPreg(${i}, -1)" class="${i==0?'oculta':'activa'}" >
    <-
    </button>`;
    htmlStr += `<button type="button" name="moure" value="1" onclick="canviarPreg(${i}, 1)" class="${i==preguntesRand.length-1?'oculta':'activa'}" >
    ->
    </button></div>`;

    htmlStr += `</div>`;

  }

 
  document.getElementById("partida").innerHTML = htmlStr;
}

function procesarResultados(resultats){

  document.getElementById("partida").classList.remove("activa");
  document.getElementById("partida").classList.add("oculta");
  document.getElementById("enviar").classList.remove("activa");
  document.getElementById("enviar").classList.add("oculta");

  document.getElementById("title_res").classList.remove("oculta");
  document.getElementById("title_res").classList.add("activa");
  document.getElementById("resultats").classList.remove("oculta");
  document.getElementById("resultats").classList.add("activa");
  document.getElementById("tornarJugar").classList.remove("oculta");
  document.getElementById("tornarJugar").classList.add("activa");

  let htmlResStr = '';

  htmlResStr += `
  <img id="img_aprobat"src="../images/${resultats.correctes > 4 ?"check.png":"cross.png"}" alt="imatge_rellotge">
  <p id="encertades">${resultats.correctes}/${(resultats.correctes+resultats.incorrectes)}</p>
  <img id="img_crono" src="../images/cronometro.png" alt="imatge_aprobat">
  <p id="tempsTrigat">${tempsMin}:${(tempsSec<10?"0"+tempsSec:tempsSec)}</p>
  `;

  document.getElementById("resultats").innerHTML = htmlResStr;
  

}
document.getElementById("tornarJugar").addEventListener("click",function () {
  fetch('../backEnd/preguntesAleatories.php')
  .then(response => response.json())
  .then(datos => crearPartida(datos));
  document.getElementById("tornarJugar").classList.remove("activa");
  document.getElementById("tornarJugar").classList.add("oculta");
  document.getElementById("titlePreg").className = "activa";

  document.getElementById("iniciar").classList.remove("oculta");
  document.getElementById("iniciar").classList.add("activa");
  document.getElementById("zoneIniciar").classList.remove("oculta");
  document.getElementById("zoneIniciar").classList.add("activa");

  document.getElementById("title_res").classList.remove("activa");
  document.getElementById("title_res").classList.add("oculta");
  document.getElementById("resultats").classList.remove("activa");
  document.getElementById("resultats").classList.add("oculta");
  document.getElementById("resultats").innerHTML = "";
  document.getElementById("tornar_inici").className = "oculta";
})


document.getElementById("enviar").addEventListener("click",function(){

  document.getElementById("temps").className = "oculta";
  document.getElementById("tornar_inici").className = "oculta";
  clearInterval(TEMPS);

  const data = new FormData();
  data.append("dades", JSON.stringify(respostesBack));

  fetch('../backEnd/post.php',{
    method: 'POST',
    body:data
  })
  .then(response => response.json())
  .then(data => procesarResultados(data));

})

function guardaResposta(idResp, respost) {
    afegida = false;
    let i = 0;
    while(i < respostesBack.length && !afegida){
      if(respostesBack[i].pregunta == idResp){
        afegida = true;
        respostesBack[i].resposta = respost;
      }
      else{
        i++;
      }
    }
    if(!afegida){
      respostesBack.push({pregunta: idResp, resposta: respost});
    }

    for (let j = 0; j < 4; j++) {
      let resp="pregunta"+idResp+"resposta"+j;
      if(j == respost){
        document.getElementById(resp).style.backgroundColor = '#868378';
      } else{
        document.getElementById(resp).style.backgroundColor = '#beb7a4';
      }
      
    }
}

function canviarPreg(idPreg, moure) {
    if(document.getElementById(idPreg+moure)){
        document.getElementById(idPreg).classList.remove("activa");
        document.getElementById(idPreg).classList.add("oculta");
        document.getElementById(idPreg+moure).classList.remove("oculta");
        document.getElementById(idPreg+moure).classList.add("activa");
    }
    if(idPreg+moure == 9){
        document.getElementById("enviar").classList.remove("oculta");
        document.getElementById("enviar").classList.add("activa");
    } else if(idPreg+moure < 9){
      document.getElementById("enviar").classList.remove("activa");
      document.getElementById("enviar").classList.add("oculta");
    }
}

document.getElementById("tornar_inici").addEventListener("click",function(){
  fetch('../backEnd/preguntesAleatories.php')
  .then(response => response.json())
  .then(datos => crearPartida(datos));


  document.getElementById("temps").className = "oculta";

  clearInterval(TEMPS);
  document.getElementById("titlePreg").className = "activa";

  document.getElementById("iniciar").classList.remove("oculta");
  document.getElementById("iniciar").classList.add("activa");
  document.getElementById("zoneIniciar").classList.remove("oculta");
  document.getElementById("zoneIniciar").classList.add("activa");
  document.getElementById("tornar_inici").className = "oculta";
  document.getElementById("partida").classList.remove("activa");
  document.getElementById("partida").classList.add("oculta");
  document.getElementById("enviar").classList.remove("activa");
  document.getElementById("enviar").classList.add("oculta");
  document.getElementById("title_res").classList.remove("activa");
  document.getElementById("title_res").classList.add("oculta");
  document.getElementById("resultats").classList.remove("activa");
  document.getElementById("resultats").classList.add("oculta");
  document.getElementById("tornarJugar").classList.remove("activa");
  document.getElementById("tornarJugar").classList.add("oculta");
})