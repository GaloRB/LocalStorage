/* **********variables*************** */
const formulario = document.querySelector('#formulario');
const listaTweets = document.querySelector('#lista-tweets');
let tweets = [];


/* *******Event listeners*********** */
eventListeners();


/* *******Funciones***************** */
function eventListeners() {
    // cuando se agrega un nuevo tweet
    formulario.addEventListener('submit', agregarTweet);

    // Cuando el docuemnto este listo
    document.addEventListener('DOMContentLoaded', () => {
        tweets = JSON.parse(localStorage.getItem('tweets')) || [];

        console.log(tweets);

        crearHtml();
    })
}

function agregarTweet(e) {
    e.preventDefault();

    // Text area done el usuario escribe
    const tweet = document.querySelector('#tweet').value;

    if (tweet === '') {
        mostrarError('El mensaje no puede estar vacio');
        return; // el return evita que se siga ejecutando más códigi, funciona simpre y cuando el if este dnetro de una función
    }

    const tweetObjt = {
        id: Date.now(),
        tweet // cuando la llave y el valor tiene el mimso nombre se puede dejar solo uno para los dos
    };

    // Añadir al arrgelo de tweets
    tweets = [...tweets, tweetObjt];
    console.log(tweets);

    // Una vez agregado al areglo creamos el html
    crearHtml();

    // reiniciar el formulario
    formulario.reset();
}

// muestra un mensaje de error
function mostrarError(error) {
    const mensajeError = document.createElement('P');
    mensajeError.textContent = error;
    mensajeError.classList.add('error');

    // Insertar el mensaje
    const contenido = document.querySelector('#contenido');
    contenido.appendChild(mensajeError);

    setTimeout(() => {
        mensajeError.remove();
    }, 2000)
}

// muestra el listado de los tweets agregados
function crearHtml() {

    limpiarHtml();

    if (tweets.length > 0) {
        tweets.forEach(tweet => {
            // Se crea la lista de html
            const li = document.createElement('li');

            // crea boton de elminiar en html
            const btnEliminar = document.createElement('a');
            btnEliminar.classList.add('borrar-tweet');
            btnEliminar.innerText = 'X';

            // Añadir la función de eliminar
            btnEliminar.onclick = () => {
                eliminarTweet(tweet.id);
            }

            // añadir el texto
            li.innerText = tweet.tweet;

            // Añadir el boton
            li.appendChild(btnEliminar);

            // insertarlo en el html
            listaTweets.appendChild(li);
        })
    }

    sincronizarStorage();
}

// limpia el html de la lista de tweets
function limpiarHtml() {
    while (listaTweets.firstChild) {
        listaTweets.removeChild(listaTweets.firstChild);
    }
}

// borra los tweets del html
function eliminarTweet(id) {
    tweets = tweets.filter(tweet => tweet.id !== id);
    console.log(tweets);
    crearHtml();
}

// Agrega tweets a localsotrage
function sincronizarStorage() {
    localStorage.setItem('tweets', JSON.stringify(tweets));
}