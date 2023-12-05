import * as THREE from 'three';
import TestScene from './TestScene.js';

const scene = new TestScene();
const sizes = {
    x: window.innerWidth,
    y: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, sizes.x / sizes.y, 0.1, 1000);
camera.position.z = 5;
const canvas = document.querySelector('canvas.webgl')
document.addEventListener('keydown', scene.onDocumentKeyPress);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});
renderer.setSize(sizes.x, sizes.y);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', onResize);
function onResize() {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function animate() {
    scene.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();