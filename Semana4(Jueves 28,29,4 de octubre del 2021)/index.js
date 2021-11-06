// importamos todos los modules que vamos a utilizar para realiazar las diferentes conexiones
const mongoose      = require('mongoose');
const cheerio       = require('cheerio');
const node_cron     = require('node-cron');
const axios         = require('axios').default;
const { MONGO_URL } = require('./config');    
const { News }      = require('./models');

// con node_cron decimos o etablecemos un tiempo para que se ingresen nuevos registros cada cierto tiempo 
node_cron.schedule("* * * * *", async () => {

// con el try lo que hacemos es que vamos a ver si no hay ningun error en el codigo y si lo hay salta a la parte del catch donde atrapa el error y lo muestra
try{
    // conexion a base de datos
    const conection = await mongoose.connect( MONGO_URL);
    console.log(conection);
    // guardamos en una variable la respuesta de la paguina wed de cnn donde vamos a recibir toda esa informacion desde esa pagina 
    const html = await axios.get(" https://cnnespanol.cnn.com ");
    // con cheerio hacemos que destructuramos todo lo que guardamos en html que es la estructura del sitio web y mostramos solo los datos en texto 
    const $ =  cheerio.load(html.data);
    // con este solo requerimos los titulos news__title en especifico
    const title =  $(".news__title");

    // creamos un array para guardar los regiustros de las noticias
    let arrayNews = [];
    // realizamos el recorrido de cada uno de los titulos de la pagina que estan en news__title 
    title.each( async ( index,element ) => {

        // creamos un arreglo para guardar esa informacion y enviarla a la base de datos 
        const Newss =
        { 
            // solo enviamos los titulos de las noticias
            title:  $(element).text() ,
            // enviamos a la base de datos los nodos hijos y la ruta de esa noticia 
            link:   $(element).children().attr('href')
        }
        //await News.create(newss);
    
        arrayNews = [...arrayNews, Newss] 
    });
    // por cada noticia enviamos a guardar a la base de datos
    News.create(arrayNews)

// si existe un error con el catch mostrara en consola el error
}  catch (error) {
    
        console.log(error);
    }
});
