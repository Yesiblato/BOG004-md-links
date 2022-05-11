const { error } = require("console");
const fs = require("fs");
const { resolve } = require("path");
// const { rejects } = require('assert');
const path = require("path");
const { openStdin } = require("process");
const process = require("process");
//const axios = require("axios").default
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
// const marked = require('marked');
// mdlinks(route);
const route = process.argv[2];
// Verifica si la ruta es absoluta, y si no la convierte
const pathAbsolute = (route) => path.isAbsolute(route) ? route : path.resolve(route);
// Verifica si la extension es MD
const fileMD = (route) => path.extname(route) === '.md' ? route : "";//"Archivo no compatible con la busqueda";
//console.log("file md ", fileMD(route));

//----------si es archivo directorio

const identify = (route) => {
  let files = []
  return new Promise((resolve, reject) => {
    fs.stat(route, (err, stats) => {
      if (err) {
        reject('La ruta no existe');
      } else if (stats.isFile()) {
        if (fileMD(route) === route) {
          files.push(route)
          resolve(files)
        }
      }
      else if (stats.isDirectory()) {
        files = recursion(route)
        resolve(files)
      }
    });
  })
};
//---- leer un archivo----
const readFiles = (route) => {
  return new Promise((resolve, reject) => {
    fs.promises.readFile(route, 'utf-8')
      .then(resp => {
        resolve(resp)
      })
      .catch(() => reject('Error en la lectura del archivo'))
  });
};
//
const obtenerLinks = (arrayMD) => {
 return new Promise ((resolve, reject) => {
    let arr = []
    arrayMD.forEach((md) =>{
      getObjects(md)
      .then((resp) => {
        arr.push(resp)
        // console.log("------------>>>>>>>>", arr.flat());
        resolve(arr.flat())
      })
    })
  })
}
//Funcion de extrear links
const getObjects = (file) => {
  return new Promise((resolve, reject) =>{
    let arrContentObj = []
    let arrMatches = []
    const retMdLinks = /\[([^\[]+)\](\(.*\))/gm;
      readFiles(file)
      .then((resp) => {
        arrMatches = resp.match((retMdLinks));
      if (arrMatches !== null) {
        const singleMatch = /\[([^\[]+)\]\((.*)\)/;
        arrMatches.forEach((link) =>{
          const match = singleMatch.exec(link)
          arrContentObj.push( {
            href: match[2],
            text: match[1].substring(0, 50),
            file,
          })
        })
          resolve(arrContentObj)
      } else{
        console.log('no hay links');
      }
      })
  })
}
//----- lee un directorio/ funcion recursiva---
const recursion = (route) => {
  let newArr = [];
  let recursive = []
  let array = fs.readdirSync(route);
  array.forEach((item) => {
    const newRoute = path.resolve(route, item);
    switch (path.extname(newRoute)) {
      case ".md": {
        newArr.push(newRoute);
        break;
      }
      case "": {
        recursive = recursive.concat(recursion(newRoute));
        if (recursive.length > 0) {
          newArr.push(...recursive);
        }
        break;
      }
    }
  });
  return newArr;
};

const mdlinks = (path, options = {validate, stats}) =>{
  return new Promise((resolve, reject) => {
  identify(pathAbsolute(path))
  .then((response) => {
      obtenerLinks(response)
      .then((resp) => {
        if(options.validate === '' || options.validate === 'false' ){
          console.log(resp);
          resolve(resp)
        }
          validateHttp(resp)
          .then(response => {
            if(options.validate === '--validate' || options.validate === '--v'){
              console.log('validateHttp --->:', response)
            }else if(options.stats === '--stats' || options.stats === '--s'){
              console.log(statsLinks(response));
              resolve(statsLinks(response));
            }else if (options.validate === '--validate' || options.validate === '--v' && options.stats === '--stats' || options.stats === '--s'){
              console.log(statsBrokens(response));
              resolve(statsBrokens(response));
            }
          })
          .catch((error) => console.log('Error validateHttp identify', error))
        
      })
      .catch((error) => console.log("error de get", error))
    
    
  })
  .catch((error) => console.log(error))
  }
  )
}
// mdlinks(route, {validate:'--v', stats:''} );

const statsLinks = (res) => {
    return {
    total: res.length,
    unique: new Set(res.map(({href}) => href)).size,
  }
}
const statsBrokens = (res) => {
  const brokens = res.filter(link => link.result === 'FAIL').length
  return {
    total: res.length,
    unique: new Set(res.map(({href}) => href)).size,
    broken: brokens
  }
}




// Validacion http
const validateHttp = (arr) => {
  const arrValidate = arr.map((link) => {
    return fetch(link.href)
    .then((response) => {
      if(response.status >= 200 && response.status <= 399){
          link.status = response.status,
          link.result = 'OK'
          return link
      } else if(response.status >= 400 && response.status <= 499){
          link.status = response.status,
          link.result = 'FAIL'
          return link
      }
    })
    .catch ((error) => console.log(error))
})
 return Promise.all(arrValidate)
}


module.exports = () => {
mdlinks
};





/*----------------------
ANIDAMIENTO
prom(param)
  .then(respuesta => otraProm(respuesta)
    .then(segRespuesta => terPromesa(segRespuesta)
      .then(final => console.log(final))
      .catch(err)
      )
    .catch(err)
    )
  .catch(err)
ENCADENAMIENTO
prom(param)
  .then(respuesta => return otraProm(respuesta))
  .then(segRespuesta => return terPromesa(segRespuesta))
  .then(final => console.log(final))
  .catch(err)
  -------------------------*/