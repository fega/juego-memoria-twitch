class Reloj {
  constructor(){
    this.tiempo = TIEMPO_INICIAL;
    
    this.interval = setInterval(() => this.onTick(), UN_SEGUNDO)
  }

  comprobarTiempo(){
    if (this.tiempo<=0) {

      alert('Perdiste :(');
      this.limpiarReloj();
      window.location.reload();
    }
  }
  
  añadirTiempo(){
    this.tiempo += 5;
  }
  
  limpiarReloj(){
    clearInterval(this.interval);
  }

  onTick(){
    this.tiempo -= 1;
    document.getElementById('tiempo-de-juego').innerHTML = `Tiempo restante: ${this.tiempo}`
    this.comprobarTiempo();
    console.log(this.tiempo);

  }
}

const parametros = obtenerParametrosDeJuego();
const TARJETAS_UNICAS = parametros.pares;
const TIEMPO_INICIAL = parametros.tiempo; // segundos
const UN_SEGUNDO = 1000; 
const reloj =  new Reloj();
const colores = ['rosado', 'naranja', 'morado', 'amarillo'];

console.log(window.location)


const data = new Array(TARJETAS_UNICAS).fill('').map((data, index) => index);
const cuadritos = desordenar([...data, ...data]);

console.log('cuadritos: ', cuadritos)

let parSeleccionado = [];



function obtenerColorDeClase(imageId){
  const index = imageId % colores.length; 

  return colores[index];
}

function obtenerParametrosDeJuego(){
  const queryString = Qs.parse(window.location.search.replace('?',''));

  let pares = 5;
  const paresQueryString = parseInt(queryString.pares || '5', 10);

  if (paresQueryString<=0){
    pares = 5
  } else if (paresQueryString>=47){
    pares= 47
  } else {
    pares = paresQueryString;
  }

  let tiempo = 30;
  const tiempoQueryString = parseInt(queryString.tiempo || '30');

  if (tiempoQueryString <=5){
    tiempo = 5;
  } else{
    tiempo = tiempoQueryString;
  }

  console.log("Cuantos pares en mi juego? ", pares);

  return {pares, tiempo};
}

function desordenar(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function eliminarTarjeta(tarjetaSeleccionada, tarjetaAnterior){
  
  tarjetaSeleccionada.addEventListener('transitionend', ()=>{
    console.log(tarjetaSeleccionada.children)
    tarjetaSeleccionada.children[0].addEventListener('transitionend', ()=>{
      tarjetaSeleccionada.innerHTML='';
      tarjetaAnterior.innerHTML='';
      revisarSiUsuarioGano();
    })
    tarjetaAnterior.classList.add('encoger')
    tarjetaSeleccionada.classList.add('encoger')
    
  })
}

function revisarSiUsuarioGano(){
  const tarjetas = document.getElementsByClassName('tarjeta-relleno');
  if (tarjetas.length===0){
    reloj.limpiarReloj()
    alert('ganaste!')
  }
}

function onClick(tarjetaId, imagenId) {
  console.log('tarjetaId: ', tarjetaId)
  console.log('imagen: ', imagenId)

  const tarjetaSeleccionada = document.getElementById(tarjetaId);

  if (tarjetaSeleccionada.classList.contains('voltear')) {
    return;
  }

  tarjetaSeleccionada.classList.add('voltear');

  if (parSeleccionado.length === 0) {
    parSeleccionado[0] = { imagenId, tarjetaId };
  }
  else if (parSeleccionado.length === 1) {
    parSeleccionado[1] = { imagenId, tarjetaId };
    if (parSeleccionado[0].imagenId === parSeleccionado[1].imagenId) {
      const tarjetaAnterior = document.getElementById(parSeleccionado[0].tarjetaId);
      
      reloj.añadirTiempo();
      eliminarTarjeta(tarjetaSeleccionada, tarjetaAnterior)

      parSeleccionado = [];
    }

  } else if (parSeleccionado.length === 2) {
    const tarjeta1 = document.getElementById(parSeleccionado[0].tarjetaId);
    const tarjeta2 = document.getElementById(parSeleccionado[1].tarjetaId);
    tarjeta1.classList.remove('voltear');
    tarjeta2.classList.remove('voltear');

    parSeleccionado = [];
    parSeleccionado[0] = { imagenId, tarjetaId };
  }
  console.log('par seleccionado:', parSeleccionado)
}


const html = cuadritos.map((imagenId, index) => `
<div 
  id="tarjeta-${index}" 
  class="tarjeta wrapper" 
  data-tilt
  data-tilt-glare data-tilt-max-glare="1" 
  data-tilt-scale="1.1"
  data-tilt-startX="20"
  data-tilt-max="40"
  onclick="onClick('tarjeta-${index}', ${imagenId})">
    <div class="flipper tarjeta-relleno">
      <div class="frente"></div>
      <div class="atras ${obtenerColorDeClase(imagenId)}">
        <div class="circulo-atras">
          <img class="icon" src="./icons/${imagenId}.svg">
        </div>
      </div>
    </div> 
  </div>`
).join('');

const contenedorJuego =  document.getElementById('jueguito-de-memoria')


contenedorJuego.innerHTML = html;
contenedorJuego.style.width = `${140 * Math.sqrt(TARJETAS_UNICAS*2)}px`
contenedorJuego.style.height = `${110 * Math.sqrt(TARJETAS_UNICAS*2)}px`