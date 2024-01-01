import * as THREE from 'three';
import TemplatePage from './TemplatePage.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export default class WebsiteContent extends TemplatePage {
    contentWindow;
    scene;
    properties;
    header;
    websiteContentGroup;
    previousText = "";
    previousTextObject;

    textRenderer;

    itemDescription;
    descriptionContainer;

    itemTitle;
    titleContainer;

    constructor(scene, properties) {
        super();
        this.scene = scene;
        this.properties = properties;

        this.contentWindow = new THREE.Group();
        this.websiteContentGroup = new THREE.Group();

        this.createTextRenderer();

        const titlePosition = new THREE.Vector2(3.3, 0);
        this.createItemTitleText(50, titlePosition);

        const descriptionPosition = new THREE.Vector2(3.3, 0);
        this.createItemDescriptionText(20, descriptionPosition);
    }

    createTextRenderer() {
        this.textRenderer = new CSS2DRenderer();
        this.textRenderer.setSize(this.properties.size.x, this.properties.size.y);
        this.textRenderer.domElement.style.position = 'absolute';
        this.textRenderer.domElement.style.top = '0px';
        document.body.appendChild(this.textRenderer.domElement);
    }

    createItemTitleText(customFontSize = 50, position) {
        this.itemTitle = document.createElement('p');
        this.itemTitle.style.color = 'white';
        this.itemTitle.style.fontSize = `${customFontSize}` + 'px';
        this.itemTitle.style.width = '40vw';

        this.titleContainer = new CSS2DObject(this.itemTitle);
        this.websiteContentGroup.add(this.titleContainer);
        this.titleContainer.position.set(position.x, position.y, 0);
    }

    createItemDescriptionText(customFontSize = 20, position) {
        this.itemDescription = document.createElement('p');
        this.itemDescription.style.color = 'white';
        this.itemDescription.style.fontSize = `${customFontSize}` + 'px';
        this.itemDescription.style.width = '40vw';

        this.descriptionContainer = new CSS2DObject(this.itemDescription);
        this.websiteContentGroup.add(this.descriptionContainer);
        this.descriptionContainer.position.set(position.x, position.y, 0);
    }

    createWindow() {
        this.createBackground();
        this.setItemTitle("Portfolio content", new THREE.Vector2(3.3, 0));
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

    setItemTitle(newText, position) {
        this.itemTitle.textContent = newText;
        this.titleContainer.position.x = position.x;
        this.titleContainer.position.y = position.y;
    }

    setItemDescriptionText(newText, position) {
        this.itemDescription.innerHTML = newText;
        console.log(this.itemDescription.innerHTML);
        //this.itemDescription.textContent = newText;
        this.descriptionContainer.position.x = position.x;
        this.descriptionContainer.position.y = position.y;
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
