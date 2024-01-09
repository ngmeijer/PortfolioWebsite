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
    previousButton;
    nextButton;
    imageElement;
    currentIndex;

    iframeParent;

    rootPath = "https://nilsmeijer.com/Terminal/";

    constructor(scene, properties) {
        super();
        this.scene = scene;
        this.properties = properties;

        this.contentWindow = new THREE.Group();
        this.websiteContentGroup = new THREE.Group();

        this.iframeParent = document.getElementById('iframe-container');

        this.createItemTitleText();
        this.createItemDescriptionText();
        this.createImageGallery();
    }

    createItemTitleText() {
        this.itemTitle = document.getElementById('title');
        this.itemTitle.textContent = "Portfolio";
    }

    createItemDescriptionText() {
        this.itemDescriptionText = document.getElementById('description');
    }

    createImageGallery() {
        this.previousButton = document.getElementById('previous-image-button');
        this.previousButton.style.display = 'none';
        this.previousButton.onclick = () => this.setCurrentImage(-1);

        this.nextButton = document.getElementById('next-image-button');
        this.nextButton.style.display = 'none';
        this.nextButton.onclick = () => this.setCurrentImage(1);

        this.imageElement = document.getElementById('current-image');
        this.imageElement.style.display = 'none';
    }

    createWindow() {
        this.createBackground();
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

    setItemTitle(newText) {
        this.itemTitle.textContent = newText;
    }

    setItemDescriptionText(newText) {
        this.itemDescriptionText.innerHTML = newText;
    }

    setCurrentImage(direction) {
        console.log(direction);

        let newIndex = this.currentIndex + direction;
        if (newIndex < 0)
            newIndex = this.receivedImageURLs.length - 1;
        if (newIndex > this.receivedImageURLs.length - 1)
            newIndex = 0;

        this.currentIndex = newIndex;
        let path = this.rootPath + this.receivedImageURLs[this.currentIndex];
        this.imageElement.src = path;
    }

    setIFrameContent(videoLinks) {
        let videoArray = videoLinks.split('\n');
        var iframe = document.createElement("iframe");

        if (this.iframeParent) {
            this.iframeParent.appendChild(iframe);
            iframe.setAttribute("src", videoArray[0]);
            iframe.setAttribute('allowfullScreen', 'true')
            iframe.style.width = "640px";
            iframe.style.height = "480px";
        }
    }

    setGalleryContent(images) {
        if (images.length === 0)
            return;

        this.imageElement.style.display = 'block';
        this.receivedImageURLs = images;
        let hasMultipleImages = images.length > 1;
        this.currentIndex = 0;

        if (hasMultipleImages === false) {
            this.previousButton.style.display = 'none';
            this.nextButton.style.display = 'none';
        } else {
            this.previousButton.style.display = 'block';
            this.nextButton.style.display = 'block';
        }

        let imageElement = document.getElementById('current-image');
        let path = this.rootPath + images[this.currentIndex];
        imageElement.src = path;
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
