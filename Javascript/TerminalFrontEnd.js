import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export default class TerminalFrontEnd {
    scene;
    fontLoader;
    loadedFont;
    inputFieldGroup;
    terminalContentGroup;
    cursorVisible = true;
    caretTick;
    properties;
    inputFieldContent = "";
    inputFieldTextObject;
    currentDirectory = "";

    constructor(scene) {
        this.scene = scene;
        this.fontLoader = new FontLoader();

        this.inputFieldGroup = new THREE.Group();
        this.terminalContentGroup = new THREE.Group();

        this.inputFieldGroup.position.set(-9.3, -4.2, 0);
        this.terminalContentGroup.position.set(-9.3, -3.7, 0);

        this.scene.add(this.inputFieldGroup);
        this.scene.add(this.terminalContentGroup);

        this.createCursorTick();
        this.createBackground();

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
            this.loadedFont = await new Promise((resolve, reject) => {
                this.fontLoader.load('../../static/fonts/hack.json', (font) => {
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

        //this.addToTerminalContent(this.asciiArt, 0.2);
        this.addToTerminalContent(this.properties.customDefaultText[0])
        this.addToTerminalContent(this.properties.customDefaultText[1])
        this.addToTerminalContent("Enter 'help' to show a list of available commands.")

        setInterval(() => {
            this.loopCursorTick();
        }, 600);
        this.updateInputField();
    }

    createBackground() {
        const backgroundGeometry = new THREE.BoxGeometry(100, 0.4, 100);
        const backgroundMaterial = new THREE.MeshPhongMaterial({ color: 0x322222 });
        this.backgroundPlane = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        this.backgroundPlane.position.set(0.6, 0.1, -0.1);
        this.backgroundPlane.rotateOnAxis(new THREE.Vector3(1, 0, 0), 90);
        this.terminalContentGroup.add(this.backgroundPlane);
    }

    addToTerminalContent(textGiven, customFontSize = 0.12) {
        let newLine;

        if (textGiven == undefined) {
            console.log("text given is not valid.")
            return;
        }
        const textGeometry = new TextGeometry(textGiven, {
            font: this.loadedFont,
            size: customFontSize,
            height: 0.01,
        });
        newLine = new THREE.Mesh(textGeometry);

        this.terminalContentGroup.traverse(function (object) {
            if (object.type != "Group")
                object.position.y += 0.28;
        });

        this.terminalContentGroup.add(newLine);
    }

    createCursorTick() {
        const cursorGeometry = new THREE.BoxGeometry(0.02, 0.4, 0.02);
        const cursorMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: new THREE.Color(0xffffff), emissiveIntensity: 1000 });
        this.caretTick = new THREE.Mesh(cursorGeometry, cursorMaterial);
        this.inputFieldGroup.add(this.caretTick);
        this.caretTick.position.set(0.6, 0.1, 0);
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
            font: this.loadedFont,
            size: 0.2,
            height: 0.01,
        });
        this.inputFieldTextObject = new THREE.Mesh(textGeometry);
        this.inputFieldGroup.add(this.inputFieldTextObject);
        this.inputFieldTextObject.updateMatrixWorld();

        this.inputFieldTextObject.geometry.computeBoundingBox();
        const boundingBox = this.inputFieldTextObject.geometry.boundingBox;
        const centerX = (boundingBox.min.x + boundingBox.max.x) / 2;
        const defaultOffset = 0.05;
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
            // Replace everything before "/Dir" with an empty string
            return directory.replace(/.*\/Terminal/, '');
        });
        for (let i = 0; i < dirArray.length; i++) {
            let dirName = dirArray[i];
            this.addToTerminalContent(" - " + dirName);
        }

        //Files
        this.addToTerminalContent("Files in " + this.currentDirectory);
        const fileArray = data.files.map(directory => {
            // Replace everything before "/Dir" with an empty string
            return directory.replace(/.*\/Terminal/, '');
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