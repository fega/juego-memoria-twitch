const TARJETAS_UNICAS = 10

const data = new Array(TARJETAS_UNICAS).fill('').map((data, index) => index);
const cuadritos = desordenar([...data, ...data]);

console.log('cuadritos: ', cuadritos)

let parSeleccionado = [];


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
    tarjetaSeleccionada.innerHTML='';
    tarjetaAnterior.innerHTML='';
    revisarSiUsuarioTermino();
  })
}

function revisarSiUsuarioTermino(){
  const tarjetas = document.getElementsByClassName('tarjeta-relleno');
  if (tarjetas.length===0){
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

const html = cuadritos.map((imagen, index) => `
<div id="tarjeta-${index}" class="tarjeta wrapper" data-tilt onclick="onClick('tarjeta-${index}', ${imagen})">
    <div class="flipper tarjeta-relleno">
      <div class="frente"></div>
      <div class="atras">
        <div class="circulo-atras">
          <img class="icon" src="./icons/${imagen}.svg">
        </div>
      </div>
    </div> 
  </div>`
).join('');

const contenedorJuego =  document.getElementById('jueguito-de-memoria')


contenedorJuego.innerHTML = html;
contenedorJuego.style.width = `${140 * Math.sqrt(TARJETAS_UNICAS*2)}px`
contenedorJuego.style.height = `${110 * Math.sqrt(TARJETAS_UNICAS*2)}px`