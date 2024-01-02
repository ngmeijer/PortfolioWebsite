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

    itemDescriptionText;
    itemTitle;
    itemGallery;

    titleContainer;
    descriptionContainer;
    galleryContainer;

    receivedImageURLs;
    currentIndex;

    constructor(scene, properties) {
        super();
        this.scene = scene;
        this.properties = properties;

        this.contentWindow = new THREE.Group();
        this.websiteContentGroup = new THREE.Group();

        this.createContentRenderer();

        const titlePosition = new THREE.Vector2(3.3, 0);
        this.createItemTitleText(50, titlePosition);

        const descriptionPosition = new THREE.Vector2(3.3, 0);
        this.createItemDescriptionText(20, descriptionPosition);

        const galleryPosition = new THREE.Vector2(3.3, 0);
        this.createItemImageGallery(galleryPosition);
    }

    createContentRenderer() {
        this.textRenderer = new CSS2DRenderer();
        this.textRenderer.setSize(this.properties.size.x, this.properties.size.y);
        this.textRenderer.domElement.style.position = 'absolute';
        this.textRenderer.domElement.style.top = '0px';
        this.textRenderer.domElement.id = "ContentRenderer";
        document.body.appendChild(this.textRenderer.domElement);
    }

    createItemTitleText(customFontSize = 50, position) {
        this.itemTitle = document.createElement('p');
        this.itemTitle.style.color = 'white';
        this.itemTitle.style.fontSize = `${customFontSize}` + 'px';
        this.itemTitle.style.width = '40vw';
        this.itemTitle.id = "ItemTitle";

        this.titleContainer = new CSS2DObject(this.itemTitle);
        this.websiteContentGroup.add(this.titleContainer);
        this.titleContainer.position.set(position.x, position.y, 0);
    }

    createItemDescriptionText(customFontSize = 20, position) {
        this.itemDescriptionText = document.createElement('p');
        this.itemDescriptionText.style.color = 'white';
        this.itemDescriptionText.style.fontSize = `${customFontSize}` + 'px';
        this.itemDescriptionText.style.width = '40vw';
        this.itemDescriptionText.id = "ItemDescription";

        this.descriptionContainer = new CSS2DObject(this.itemDescriptionText);
        this.websiteContentGroup.add(this.descriptionContainer);
        this.descriptionContainer.position.set(position.x, position.y, 0);
    }

    createItemImageGallery(position) {
        this.galleryContainer = new CSS2DObject(this.itemGallery);
        this.websiteContentGroup.add(this.galleryContainer);
        this.galleryContainer.position.set(position.x, position.y, 0);

        this.itemGallery = document.createElement('div');
        this.itemGallery.style.fontSize = `${30}` + 'px';
        this.itemGallery.id = "gallery";

        this.galleryContainer = new CSS2DObject(this.itemGallery);
        this.websiteContentGroup.add(this.galleryContainer);
        this.galleryContainer.position.set(position.x, position.y, 0);
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
        this.itemDescriptionText.innerHTML = newText;
        console.log(this.itemDescriptionText.innerHTML);
        this.descriptionContainer.position.x = position.x;
        this.descriptionContainer.position.y = position.y;
    }

    setCurrentImage(direction) {
        let parent = document.getElementById("imageParent");

        let newIndex = this.currentIndex + direction;
        if(newIndex < 0)
            newIndex = parent.children.length - 1;
        if(newIndex > parent.children.length - 1)
            newIndex = 0;

        parent.children[this.currentIndex].display = 'none';
        parent.children[newIndex].display = 'block'
        this.currentIndex = newIndex;
        console.log(newIndex);
    }

    setGalleryContent(images, position) {
        this.galleryContainer.position.x = position.x;
        this.galleryContainer.position.y = position.y;

        let previousButton = document.createElement('a');
        previousButton.className = "GalleryButton";
        previousButton.innerText = "<";
        previousButton.onclick = () => this.setCurrentImage(-1);
        this.itemGallery.appendChild(previousButton);
        console.log(previousButton);

        let imageParent = document.createElement('div');
        imageParent.style.maxWidth = '50%';
        imageParent.style.maxHeight = '100%';
        imageParent.id = "imageParent";
        this.itemGallery.appendChild(imageParent);
        console.log(imageParent);
        this.currentIndex = 0;

        for (let i = 0; i < images.length; i++) {
            this.websiteContentGroup.add(this.galleryContainer);
            let imageElement = document.createElement('img');
            let path = "https://nilsmeijer.com/Terminal/" + images[i];
            imageElement.src = path;
            imageElement.style.maxWidth = '100%';
            imageElement.style.maxHeight = '100%';
            if (i !== 0) {
                imageElement.style.display = 'none';
            }
            imageParent.appendChild(imageElement);
        }

        let nextButton = document.createElement('a');
        nextButton.className = "GalleryButton";
        nextButton.innerText = ">";
        nextButton.onclick = () => this.setCurrentImage(1);
        this.itemGallery.appendChild(nextButton);
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
