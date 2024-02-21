/* **********variables*************** */
const formulario = document.querySelector('#formulario');
const listaTweets = document.querySelector('#lista-tweets');
let tweets2 = [];
let DB;
let totalTweets = {};
let almacen;


/* *******Event listeners*********** */
eventListeners();


/* *******Funciones***************** */
function eventListeners() {

    // Cuando el docuemnto este listo
    document.addEventListener('DOMContentLoaded', () => {

        //Creando DB 
        crearDB();

        setTimeout(() => {
            obtenerDatos();
        }, 100);



    })

    // cuando se agrega un nuevo tweet
    formulario.addEventListener('submit', agregarTweet);

}

function crearDB() {
    //Creando DB 
    let request = window.indexedDB.open('Tweets', 1);

    //Si hay un error
    request.onerror = (e) => {
        console.log('Hubo un error:' + e.target.errorCode);
    }

    //Si todo sale bien
    request.onsuccess = () => {
        DB = request.result;
    }

    request.onupgradeneeded = function(e) {
        const db = e.target.result;
        console.log('Base de datos creada', db);
        console.log(DB);

        const objectStore = db.createObjectStore('tweets', {
            keyPath: 'id',
            autoIncrement: true
        });


        //DEfinir columnas
        objectStore.createIndex('id', 'id', { unique: true });
        objectStore.createIndex('tweets', 'tweet', { unique: false });

        console.log('columnas creadas');
    }


}

function agregarTweet(e) {
    e.preventDefault();

    // Text area done el usuario escribe
    const tweet = document.querySelector('#tweet').value;

    if (tweet === '') {
        mostrarError('El mensaje no puede estar vacio');
        return; // el return evita que se siga ejecutando más código, funciona simpre y cuando el if este dentro de una función
    }

    //objeto para almacenar el tweet 
    const tweetObjt = {
        id: Date.now(),
        tweet // cuando la llave y el valor tiene el mimso nombre se puede dejar solo uno para los dos
    };


    // agrega a BD
    let transaction = DB.transaction(['tweets'], 'readwrite');

    transaction.oncomplete = function() {
        console.log('Tweet agregado a la bd');
    }

    transaction.onerror = function() {
        console.log('hubo un error');
    }

    const objectStore = transaction.objectStore('tweets');

    const peticion = objectStore.add(tweetObjt);

    obtenerDatos();

}


function obtenerDatos() {

    limpiarHtml();

    const objectStore = DB.transaction('tweets').objectStore('tweets');
    //leer citas de indexedDB
    DB.transaction(['tweets']).objectStore('tweets');

    objectStore.openCursor().onsuccess = function(e) {
        const cursor = e.target.result;
        if (cursor) {
            const { id, tweet } = cursor.value;
            crearHtml(id, tweet);
            cursor.continue();
        } else {
            console.log('Resgitros cargados');

        }
    }

    // reiniciar el formulario
    formulario.reset();
}

// muestra los tweets agregados a indesedDB
function crearHtml(id, tweet) {
    // Se crea la lista de html
    const li = document.createElement('li');

    // crea boton de elminiar en html
    const btnEliminar = document.createElement('a');
    btnEliminar.classList.add('borrar-tweet');
    btnEliminar.innerText = 'X';

    // Añadir la función de eliminar
    btnEliminar.onclick = () => {
        eliminarTweet(id);
    }

    // añadir el texto
    li.innerText = tweet;

    // Añadir el boton
    li.appendChild(btnEliminar);

    // insertarlo en el html
    listaTweets.appendChild(li);
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


// limpia el html de la lista de tweets
function limpiarHtml() {
    while (listaTweets.firstChild) {
        listaTweets.removeChild(listaTweets.firstChild);
    }
}

// borra los tweets del html
function eliminarTweet(id) {

    const transaction = DB.transaction(['tweets'], 'readwrite');
    const objectStore = transaction.objectStore('tweets');

    objectStore.delete(id);

    transaction.oncomplete = () => {
        obtenerDatos();
    }

    transaction.onerror = () => {
        console.log('Hubo un error');
    }

}