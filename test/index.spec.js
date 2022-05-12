const mdlinks = require('../index.js');

const path = './pruebasTest/archivo1.md';
const arrObj = [
  {
    href: 'https://nodejs.org/',
    text: 'Node.js',
    file: 'D:\\Laboratoria\\Proyectos\\Proyecto 4\\BOG004-md-links\\files\\pruebas2\\links.md',
    status: 200,
    result: 'OK'
  },
  {
    href: 'https://developer.mozilla.org/es/docs/Learn/JavaScript/Building_blocks/Functions',
    text: 'Funciones — bloques de código reutilizables - MDN',
    file: 'D:\\Laboratoria\\Proyectos\\Proyecto 4\\BOG004-md-links\\files\\pruebas2\\links.md',
    status: 404,
    result: 'FAIL'
  }
];


describe('mdLinks', () => {

  it('should be a function', () => {
    expect(typeof mdlinks).toBe('function');
  });

  it('should return a promise', () => {
    expect(mdlinks(path) instanceof Promise).toBeTruthy()
  });

});
