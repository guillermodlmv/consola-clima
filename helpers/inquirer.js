const inquirer = require('inquirer');
require('colors');

/**
 * Menu de opciones para la funcionalidad de la consola
 */
const menuOptions = [
  {
    type: 'list',
    name: 'opcion',
    message: '¿Qué desea hacer? \n',
    choices: [
      {
        value : 1,
        name: `${'1.'.green} Buscar ciudad`
      },
      {
        value : 2,
        name: `${'2.'.green} Historial`
      },
      {
        value : 0,
        name: `${'0.'.green} Salir`
      },
    ]
  }
];


//Imprime titulo de selecciona una opcion, imprime el listado que se creo anteriormente y retorna la seleccion del usuario.
const inquirerMenu = async () => {

  console.clear();

  console.log('=============================='.green);
  console.log('     Seleccione una opcion'.white);
  console.log('==============================\n'.green);

  const { opcion } = await inquirer.prompt(menuOptions);
  return opcion
}

//Es un inquirer de tipo input el cual sirve para pausar hasta que el usuario de un input o solo seleccione enter.
const pausa = async () => {
  const pausaPrompt = [{
      type: 'input',
      name: 'pausa',
      message: `Presione ${'Enter'.green } para continuar \n`,
  }]

  await inquirer.prompt(pausaPrompt)
}

/**
 * Es un inquirer de tipo pregunta el cual envia un mensaje al usuario, este puede validar el input del usuario sin
 * dejarlo avanzar hasta que cumpla con lo requerido, al final se retorna el input del usuario.
*/
const leerInput = async ( message ) => {
  const questions = [
    {
      type: 'question',
      name: 'descripcion',
      message,
      validate(value) {
        if(value.length === 0) {
          return 'Por favor inserte un valor'
        }
        return true;
      }
    }
  ]

  const { descripcion } = await inquirer.prompt(questions);
  return  descripcion;
}

//Despliga listado de todas los lugares disponibles, toma el id de la que selecciones y lo retorna.
const listarLugares = async ( lugares = [] ) => {

  choices = lugares.map( ( lugar , i ) => {
    const idx = `${ ( ( i + 1 ) + '.').green }`;

    return {
      value : lugar.id, 
      name : `${ idx } ${ lugar.nombre }`
    }; 
  })

  choices.unshift({value : 0, name : `${ (0 + '.').green } Cancelar`})

  let prompt = [{
    type: 'list',
    name: 'id',
    message: 'Seleccione un lugar: ',
    choices
  }];

  const { id } = await inquirer.prompt(prompt);
  return id;

} 

module.exports = {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
  confirmar,
  mostrarListadoChecklist
}