import * as THREE from 'three';
import TemplatePage from './TemplatePage.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export default class Portfolio extends TemplatePage {
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

    receivedImageURLs;
    previousButton;
    nextButton;
    imageElement;
    currentIndex;

    // Variables to track mouse position and resizing state
    isResizing = false;
    initialMouseX;
    initialContentLeft;
    initialContentWidth;

    initialTerminalWidth;
    currentTerminalWidth;

    iframeParent;

    rootPath = "https://nilsmeijer.com/Terminal/";

    constructor(scene, properties) {
        super();
        this.scene = scene;
        this.properties = properties;

        this.contentWindow = new THREE.Group();
        this.websiteContentGroup = new THREE.Group();

        this.iframeParent = document.getElementById('iframe-container');
        this.imageParent = document.getElementById('gallery-container');

        this.getImageGallery();
        this.getItemTitleText();
        this.getItemDescriptionText();

        const selector = document.getElementById('size-controller');
        const content = document.getElementById('content-window');
        const terminal = document.getElementById('terminal-window');

        // Event listener for mouse down on the selector
        if (selector !== undefined) {
            selector.addEventListener('mousedown', (event) => {
                this.isResizing = true;
                this.initialMouseX = event.clientX;
                this.initialContentLeft = content.offsetLeft;
                this.initialContentWidth = content.offsetWidth;
                this.initialTerminalWidth = terminal.offsetWidth;

                // Prevent text selection while dragging
                event.preventDefault();
            });
        }

        // Event listener for mouse move
        document.addEventListener('mousemove', (event) => {
            if (this.isResizing) {
                const deltaX = event.clientX - this.initialMouseX;
                let newContentWidth = this.initialContentWidth - deltaX;

                // Limit the width to 70% of the container's width
                const maxWidth = content.parentElement.offsetWidth * 0.7;
                newContentWidth = Math.min(newContentWidth, maxWidth);

                // Adjust the left position to keep the right side in the same position
                const newLeftAdjusted = this.initialContentLeft + (this.initialContentWidth - newContentWidth);

                // Check if the new width is within allowed limits
                if (newContentWidth > 500 && newContentWidth <= maxWidth) {
                    const newTerminalWidth = this.initialTerminalWidth - (newContentWidth - this.initialContentWidth);

                    // Update the terminal and content elements
                    terminal.style.width = `${newTerminalWidth}px`;
                    content.style.width = `${newContentWidth}px`;
                    content.style.left = `${newLeftAdjusted}px`;
                }
            }
        });

        // Event listener for mouse up
        document.addEventListener('mouseup', () => {
            this.isResizing = false;
            console.log("not resizing anymore.")
        });

    }

    getItemTitleText() {
        this.itemTitle = document.getElementById('title');
        this.itemTitle.textContent = "Portfolio";
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

    disableImageGallery(){
        this.previousButton.style.display = 'none';
        this.nextButton.style.display = 'none';
        this.imageElement.style.display = 'none';
    }

    clearWindow() {
        this.iframeParent.replaceChildren();
        this.imageParent.replaceChildren();
        this.itemTitle.textContent = "";
        this.itemDescriptionText.textContent = "";
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
