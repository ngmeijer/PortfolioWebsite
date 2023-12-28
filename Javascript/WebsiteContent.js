import * as THREE from 'three';
import TemplatePage from './TemplatePage.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export default class WebsiteContent extends TemplatePage {
    contentWindow;
    scene;
    properties;
    header;
    websiteContentGroup;
    previousText = "";
    previousTextObject;

    constructor(scene, properties) {
        super();
        this.scene = scene;
        this.properties = properties;

        this.contentWindow = new THREE.Group();
        this.websiteContentGroup = new THREE.Group();
    }

    createWindow() {
        this.createBackground();
        this.header = this.createText("Portfolio content", this.properties.defaultFont, 0.3);
    }

    createBackground() {
        const geometry = new THREE.BoxGeometry(10, 10, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x262626 });
        const portfolioBackground = new THREE.Mesh(geometry, material);
        this.contentWindow.add(portfolioBackground);
        this.contentWindow.position.set(4, 0, 0);
        this.scene.add(this.contentWindow);
        this.contentWindow.add(this.websiteContentGroup);
        this.websiteContentGroup.position.set(-4.7, 3.4, 1);
    }

    resetWindow(){
        this.previousTextObject = null;
        this.websiteContentGroup.children = [];
    }

    setTitle(newTitle){
        this.header = this.createText(newTitle, this.properties.defaultFont, 0.3);
        this.websiteContentGroup.add(this.header);
    }

    createText(newText, fontGiven = this.properties.defaultFont, customFontSize = 0.12) {
        let newTextObject;

        const textGeometry = new TextGeometry(newText, {
            font: fontGiven,
            size: customFontSize,
            height: 0.01,
            color: 0xff0000
        });
        newTextObject = new THREE.Mesh(textGeometry);
        this.websiteContentGroup.add(newTextObject);
        // Using split to count occurrences of "\n"

        if (this.previousTextObject != undefined) {
            const lastLineCount = (this.previousText.match(/\n/g) || []).length + 1;
            const lineHeight = 0.5;
            const cumulativeHeight = lineHeight * lastLineCount;

            let previousPos = this.previousTextObject.position;
            newTextObject.position.set(previousPos.x, previousPos.y - cumulativeHeight, previousPos.z);
        }

        this.previousText = newText;
        this.previousTextObject = newTextObject;

        return newTextObject;
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
