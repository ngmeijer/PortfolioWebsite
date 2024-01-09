import * as THREE from 'three';
import Stats from 'stats.js';
import MainScene from './Website.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const sizes = {
    x: window.innerWidth,
    y: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, sizes.x / sizes.y, 0.1, 1000);
const scene = new MainScene(sizes, camera);

const aspectRatio = sizes.x / sizes.y
camera.position.z = 6;
const canvas = document.querySelector('canvas.webgl')
document.addEventListener('keydown', scene.onDocumentKeyPress);
document.addEventListener('keyup', scene.onDocumentKeyRelease);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.x, sizes.y);
document.body.appendChild(renderer.domElement);
const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)
//const controls = new OrbitControls(camera, renderer.domElement);
window.addEventListener('resize', onResize);
function onResize() {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(sizes.width, sizes.height);
}

function animate() {
    stats.begin();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    stats.end();
}
animate();