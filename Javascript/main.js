import Stats from 'stats.js';
import MainScene from './Website.js';

const scene = new MainScene();
const canvas = document.querySelector('canvas.webgl')
document.addEventListener('keydown', scene.onDocumentKeyPress);
document.addEventListener('keyup', scene.onDocumentKeyRelease);
