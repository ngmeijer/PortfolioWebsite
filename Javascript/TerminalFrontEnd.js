import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import PortfolioContent from './PortfolioContent';

export default class TerminalFrontEnd {
    scene;
    fontLoader;
    defaultFont;
    asciiFont;
    inputFieldGroup;
    terminalContentGroup;
    cursorVisible = true;
    portfolioContent;
    caretTick;
    properties;
    inputFieldContent = "";
    inputFieldTextObject;
    currentDirectory = "";
    startingUp;
    previousLine = "";

    constructor(scene, properties) {
        this.scene = scene;
        this.properties = properties;
        this.fontLoader = new FontLoader();
        this.startingUp = true;
        this.inputFieldGroup = new THREE.Group();
        this.terminalContentGroup = new THREE.Group();

        this.inputFieldGroup.position.set(-9.3, -4.5, 0);
        this.terminalContentGroup.position.set(-9.3, -3.7, 0);

        this.scene.add(this.inputFieldGroup);
        this.scene.add(this.terminalContentGroup);

        this.createCursorTick();

        (async () => {
            try {
                await this.loadFont();
                this.createTerminal();
            } catch (error) {
                throw (error);
            }
        })();
    }

    async loadFont() {
        try {
            this.defaultFont = await new Promise((resolve, reject) => {
                this.fontLoader.load('../../static/fonts/hack.json', (font) => {
                    resolve(font);
                }, undefined, reject);
            });

            this.asciiFont = this.defaultFont = await new Promise((resolve, reject) => {
                this.fontLoader.load('../../static/fonts/Courier.json', (font) => {
                    resolve(font);
                }, undefined, reject);
            });
        } catch (error) {
            throw error;
        }
    }

    createTerminal() {
        this.currentDirectory = this.properties.defaultTerminalLine;
        this.inputFieldContent = this.properties.defaultTerminalLine;

        const lines = this.properties.asciiArt.split('\n');
        
        let delay = 0;
        // Print each line separately
        lines.forEach(line => {
            setTimeout(() => this.graduallyCreateStartingContent(line, this.asciiFont, 0), delay);
            delay += 100;
        });

        setTimeout(() => this.graduallyCreateStartingContent(this.properties.customDefaultText[0], this.defaultFont), 1000);
        setTimeout(() => this.graduallyCreateStartingContent(this.properties.customDefaultText[1], this.defaultFont), 1500);
        setTimeout(() => this.graduallyCreateStartingContent("Enter 'help' to show a list of available commands.", this.defaultFont), 2000);

        setInterval(() => {
            this.loopCursorTick();
        }, 600);
        this.createInputLineBackground();
        this.updateInputField();
        this.startingUp = false;
    }

    graduallyCreateStartingContent(text, font, xPos = 0) {
        this.addToTerminalContent(text, font, 0.12, xPos);
    }

    createBackground() {
        const backgroundGeometry = new THREE.BoxGeometry(100, 0.4, 100);
        const backgroundMaterial = new THREE.MeshPhongMaterial({ color: 0x322222 });
        this.backgroundPlane = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        this.backgroundPlane.position.set(0.6, 0.1, -0.1);
        this.backgroundPlane.rotateOnAxis(new THREE.Vector3(1, 0, 0), 90);
        this.terminalContentGroup.add(this.backgroundPlane);
    }

    createInputLineBackground() {
        const backgroundGeometry = new THREE.BoxGeometry(8.4, 0.4, 0.2);
        const backgroundMaterial = new THREE.MeshPhongMaterial({ color: 0x262626 });
        this.inputLineBackground = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        this.inputLineBackground.position.set(4.1, 0.1, -0.1);
        this.inputFieldGroup.add(this.inputLineBackground);
    }

    selectInputLine() {

    }

    addToTerminalContent(textGiven, fontGiven = this.defaultFont, customFontSize = 0.12, customXPos = 0) {
        let newLine;

        if (textGiven == undefined) {
            console.log("text given is not valid.")
            return;
        }
        const textWithTabs = textGiven.replace(/\n/g, '\n          ');

        const textGeometry = new TextGeometry(textWithTabs, {
            font: fontGiven,
            size: customFontSize,
            height: 0.01,
        });
        newLine = new THREE.Mesh(textGeometry);
        newLine.position.x = customXPos;

        // Using split to count occurrences of "\n"
        if (this.previousLine != undefined) {
            const lastLineCount = (this.previousLine.match(/\n/g) || []).length + 1;
            const lineHeight = 0.28;
            const cumulativeHeight = lineHeight * lastLineCount;

            this.terminalContentGroup.traverse(function (object) {

                if (object.type != "Group")
                    object.position.y += cumulativeHeight;
            });
        }

        this.terminalContentGroup.add(newLine);
        this.previousLine = textGiven;
    }

    createCursorTick() {
        const cursorGeometry = new THREE.BoxGeometry(0.2, 0.02, 0.01);
        const cursorMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: new THREE.Color(0xffffff), emissiveIntensity: 1000 });
        this.caretTick = new THREE.Mesh(cursorGeometry, cursorMaterial);
        this.inputFieldGroup.add(this.caretTick);
    }

    loopCursorTick() {
        switch (this.cursorVisible) {
            case true:
                this.enableCursorTick(false);
                break;
            case false:
                this.enableCursorTick(true);
                break;
        }
        this.cursorVisible = !this.cursorVisible;
    }

    enableCursorTick(state) {
        switch (state) {
            case true:
                this.inputFieldGroup.remove(this.caretTick);
                break;
            case false:
                this.inputFieldGroup.add(this.caretTick);
                break;
        }
    }

    updateInputField() {
        if (this.inputFieldTextObject != undefined)
            this.inputFieldGroup.remove(this.inputFieldTextObject);

        const textGeometry = new TextGeometry(this.inputFieldContent, {
            font: this.defaultFont,
            size: 0.2,
            height: 0.01,
        });
        this.inputFieldTextObject = new THREE.Mesh(textGeometry);
        this.inputFieldGroup.add(this.inputFieldTextObject);
        this.inputFieldTextObject.updateMatrixWorld();

        this.inputFieldTextObject.geometry.computeBoundingBox();
        const boundingBox = this.inputFieldTextObject.geometry.boundingBox;
        const centerX = (boundingBox.min.x + boundingBox.max.x) / 2;
        const defaultOffset = 0.2;
        this.caretTick.position.x = centerX + (boundingBox.max.x / 2) + defaultOffset;
    }

    executeHelpCommand() {
        this.addToTerminalContent("Valid commands are:")
        const map = this.properties.validCommandsMap;
        const keyArray = Array.from(map.keys())
        const valueArray = Array.from(map.values());
        for (let i = 0; i < keyArray.length; i++) {
            this.addToTerminalContent("     " + keyArray[i] + " - " + valueArray[i]);
        }
    }

    executeDirCommand(data) {
        //Directories
        this.addToTerminalContent("Subdirectories of " + this.currentDirectory);
        const dirArray = data.directories.map(directory => {
            return directory.slice(2);
        });
        for (let i = 0; i < dirArray.length; i++) {
            let dirName = dirArray[i];
            this.addToTerminalContent(" - " + dirName);
        }

        //Files
        this.addToTerminalContent("Files in " + this.currentDirectory);
        const fileArray = data.files.map(directory => {
            return directory.slice(2);
        });
        for (let i = 0; i < fileArray.length; i++) {
            let fileName = fileArray[i];
            this.addToTerminalContent(" - " + fileName);
        }
    }

    resetInputLine() {
        this.inputFieldContent = this.currentDirectory;
        this.updateInputField();
    }

    clearTerminal() {
        this.terminalContentGroup.children.forEach(child => {
            this.terminalContentGroup.remove(child);
            if (child.geometry) {
                child.geometry.dispose();
            }
            if (child.material) {
                child.material.dispose();
                if (child.material.map) {
                    child.material.map.dispose();
                }
            }
            child = null;
        });
        this.terminalContentGroup.children.length = 0;
    }
}