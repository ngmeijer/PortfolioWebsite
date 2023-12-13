import * as THREE from 'three';
import TemplatePage from './TemplatePage.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export default class PortfolioContent extends TemplatePage {
    portfolioWindow;
    scene;
    fontLoader;
    loadedFont;

    constructor(scene) {
        super();
        this.scene = scene;
        this.fontLoader = new FontLoader();

        (async () => {
            try {
                await this.loadFont();
                this.createText("Portfolio content")
            } catch (error) {
                throw (error);
            }
        })();

        this.portfolioWindow = new THREE.Group();
        this.createPortfolioWindow();
    }

    createPortfolioWindow() {
        const geometry = new THREE.BoxGeometry(10, 10, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x262626 });
        const portfolioBackground = new THREE.Mesh(geometry, material);
        this.portfolioWindow.add(portfolioBackground);
        this.portfolioWindow.position.set(4, 0, 0);
        //this.portfolioWindow.setRotationFromAxisAngle(new THREE.Vector3(1,0,0), 0)
        this.scene.add(this.portfolioWindow);
    }

    createText(textGiven){
        let newLine;

        const textGeometry = new TextGeometry(textGiven, {
            font: this.loadedFont,
            size: 0.25,
            height: 0.01,
            color: 0xff0000
        });
        newLine = new THREE.Mesh(textGeometry);
        this.portfolioWindow.add(newLine);
        newLine.position.set(-4.7,3.4,1);
    }

    async loadFont() {
        try {
            this.loadedFont = await new Promise((resolve, reject) => {
                this.fontLoader.load('../../static/fonts/hack.json', (font) => {
                    resolve(font);
                }, undefined, reject);
            });
        } catch (error) {
            throw error;
        }
    }
}
