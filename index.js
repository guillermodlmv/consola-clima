require('colors');
require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');



const main = async () => {

  let opcion = '';
  let busquedas = new Busquedas();

  do{

    opcion = await inquirerMenu();

    switch(opcion) {
      case 1:

        //Mostrar mensaje para que persona escibra
        const terminoBusqueda = await leerInput('Inserta ciudad: ');

        //Buscar los lugares
        const lugares = await busquedas.ciudad(terminoBusqueda);

        //Mostrar opciones de lugar para que seleccione.
        const id = await listarLugares( lugares );

        if( id === 0) continue;

        //Guardar en debugger
        const lugarSeleccionado = lugares.find( l => l.id === id );

        //Clima
        const { nombre, latitud, longitud } = lugarSeleccionado;
        const clima = await busquedas.climaPorCoordenadas( latitud, longitud);
        const { temperatura, minima, maxima, descripcion } = clima;

        //Se agrega seleccion del usuario a historial
        busquedas.agregarHistorial( nombre );

        //Mostrar resultados por
        console.clear();
        console.log('\nInformacion de la ciudad \n'.green);
        console.log('Ciudad: ', nombre );
        console.log('Latitud: ', latitud);
        console.log('Longitud: ', longitud);
        console.log('Temperatura: ', temperatura);
        console.log('Minima: ', minima);
        console.log('Maxima: ', maxima);
        console.log('Estado del clima: ', descripcion.green);
      break;

      case 2:
        //Recorre todo el historial de busqueda y lo retorna uno a uno en la consola
        busquedas.HistorialCapitalizado.forEach( ( lugar, i) => {
          const idx = ` ${ (i + 1) + '.'} `
          console.log(`${ idx } ${ lugar }`);
        });

      break;

      case 0:

      break;
    }

    //Se imprime la pausa para casos que no sean salir
    console.log('\n');
    if( opcion !== 0 ) await pausa();

  }while( opcion !== 0)
  
}

//Se ejecuta la funcion
main();
