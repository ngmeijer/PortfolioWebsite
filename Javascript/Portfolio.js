import * as THREE from 'three';
import TemplatePage from './TemplatePage.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export default class Portfolio extends TemplatePage {
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

    receivedImageURLs;
    previousButton;
    nextButton;
    imageElement;
    currentIndex;

    contentWindow;
    terminalWindow;

    iframeParent;

    rootPath = "https://nilsmeijer.com/Terminal/";

    constructor(scene, properties) {
        super();
        this.scene = scene;
        this.properties = properties;

        this.websiteContentGroup = new THREE.Group();

        this.iframeParent = document.getElementById('iframe-container');
        this.imageParent = document.getElementById('gallery-container');

        this.getImageGallery();
        this.getItemTitleText();
        this.getItemDescriptionText();

        this.contentWindow = document.getElementsByClassName('content-window')[0];
        this.terminalWindow = document.getElementsByClassName('terminal-window')[0];

        this.contentWindow.addEventListener("animationend", this.onAnimationEnd, false);
    }

    onAnimationEnd(event){

    }

    getItemTitleText() {
        this.itemTitle = document.getElementById('title');
    }

    getItemDescriptionText() {
        this.itemDescriptionText = document.getElementById('description');
    }

    getImageGallery() {
        this.previousButton = document.getElementById('previous-image-button');
        this.previousButton.style.display = 'none';
        this.previousButton.onclick = () => this.setCurrentImage(-1);

        this.nextButton = document.getElementById('next-image-button');
        this.nextButton.style.display = 'none';
        this.nextButton.onclick = () => this.setCurrentImage(1);

        this.imageElement = document.getElementById('current-image');
        this.imageElement.style.display = 'none';
    }

    disableImageGallery() {
        this.previousButton.style.display = 'none';
        this.nextButton.style.display = 'none';
        this.imageElement.style.display = 'none';
    }

    clearWindow() {
        this.iframeParent.style.display = 'none';
        this.imageParent.style.display = 'none';
        this.itemTitle.textContent = "";
        this.itemDescriptionText.textContent = "";
    }

    enableContentWindow() {
        this.terminalWindow.classList.toggle('animate-terminal-window');
        this.contentWindow.classList.toggle('animate-content-window');
    }

    setItemTitle(newText) {
        this.itemTitle.textContent = newText;
    }

    setItemDescriptionText(newText) {
        this.itemDescriptionText.innerHTML = newText;
    }

    setCurrentImage(direction) {
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

        for (let i = 0; i < videoArray.length; i++) {
            var iframe = document.createElement("iframe");

            if (this.iframeParent) {
                this.iframeParent.appendChild(iframe);
                iframe.setAttribute("src", videoArray[i]);
                iframe.setAttribute('allowfullScreen', 'true')
            }
        }
    }

    setGalleryContent(images) {
        if (images.length === 0)
            return;

        this.getImageGallery();

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
