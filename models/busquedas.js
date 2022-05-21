const fs = require('fs');

const axios = require('axios');

class Busquedas {

  historial = [];
  dbPath = './db/database.json';

  constructor(){
    //TODO leer db si existe
    this.leerDb();
  }

  get HistorialCapitalizado(){
    return this.historial.map( lugar => {
      let palabras = lugar.split(' ');
      palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));

      return palabras.join(' ');

    });
    
  }

  //Retorna los parametros constantes para el llamado a la API MapBox
  get paramsMapbox(){
    return {
      'language': 'es',
      'limit': 5,
      'access_token': process.env.MAPBOX_KEY
    }
  }

  //Retorna los parametros constantes para el llamado a la API openWeather
  get openWeather( ){
    return {
      appid: process.env.OPENWEATHER_KEY,
      units : 'metric',
      lang: 'es'
    }
  }

  //Hace peticion a MapBox de la ciudad que se necesita
  async ciudad ( lugar = ''){
    //peticion http
    try{
      const instance = axios.create({
        baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
        params: this.paramsMapbox
      })
      const resp = await instance.get();
      return resp.data.features.map( lugar => {
        return {
          id : lugar.id,
          nombre: lugar.place_name,
          longitud: lugar.center[0],
          latitud: lugar.center[1]
        }
      });

    }catch(e){
      return [];
    }

  }

  //Hace la peticion de clima a openWeather basado en las cordenadas ingresadas
  async climaPorCoordenadas ( latitud ='', longitud =''){
    try{
      const { appid, units, lang } = this.openWeather;

      const params = { 
        appid,
        units,
        lang,
        lat : latitud,
        lon: longitud
      }

      const instance = axios.create({
        baseURL: 'https://api.openweathermap.org/data/2.5/weather',
        params
      });

      const resp = await instance.get();

      const { temp : temperatura, temp_min : minima, temp_max: maxima } = resp.data.main;

      return {
          descripcion : resp.data.weather[0].description,
          temperatura,
          minima,
          maxima
      };

    }catch(e){

      return [];
    }
  }

  //Agrega busquedas del usuario al historial de busqueda
  agregarHistorial( lugar = ''){

    //prevenir duplicados
    if( this.historial.includes( lugar.toLocaleLowerCase() )){
      return;
    }
    this.historial.unshift(lugar);
    this.historial = this.historial.splice(0,5);

    //Grabar en DB
    this.guardarDB();
  }

  //Guarda la db en un archivo Json
  guardarDB(){

    const payload = {
      historial : this.historial
    }

    fs.writeFileSync(this.dbPath, JSON.stringify( payload ));

  }

  //Trae los archivos almacenados en la DB
  leerDb(){
    if( !fs.existsSync( this.dbPath )) return;

    const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
    const data = JSON.parse(info);

    this.historial = data.historial;

  }

}

module.exports = Busquedas;