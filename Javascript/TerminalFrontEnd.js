import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export default class TerminalFrontEnd {
    scene;

    inputFieldGroup;
    terminalContentGroup;

    cursorVisible = true;
    caretTick;

    properties;
    inputFieldContent = "";
    inputFieldTextObject;
    startingUp;
    previousLine = "";

    autocompleteActive;

    constructor(scene, properties) {
        this.scene = scene;
        this.properties = properties;
        this.startingUp = true;

        this.inputFieldGroup = new THREE.Group();
        this.terminalContentGroup = new THREE.Group();

        this.inputFieldGroup.position.set(-9.3, -4.5, 0);
        this.terminalContentGroup.position.set(-9.3, -3.7, 0);

        this.scene.add(this.inputFieldGroup);
        this.scene.add(this.terminalContentGroup);

        this.createCaretTick();
    }

    createTerminal() {
        this.inputFieldContent = this.properties.defaultTerminalLine;

        const lines = this.properties.asciiArt.split('\n');

        let delay = 0;
        // Print each line separately
        lines.forEach(line => {
            setTimeout(() => this.graduallyCreateStartingContent(line, this.properties.asciiFont, 0), delay);
            delay += 100;
        });

        setTimeout(() => this.graduallyCreateStartingContent(this.properties.customDefaultText[0], this.properties.defaultFont), 1000);
        setTimeout(() => this.graduallyCreateStartingContent(this.properties.customDefaultText[1], this.properties.defaultFont), 1500);
        setTimeout(() => this.graduallyCreateStartingContent(this.properties.customDefaultText[2], this.properties.defaultFont), 1700);
        setTimeout(() => this.graduallyCreateStartingContent(this.properties.customDefaultText[3], this.properties.defaultFont), 2200);
        setTimeout(() => {
            this.graduallyCreateStartingContent("Enter 'help' to show a list of available commands.", this.properties.defaultFont);
            this.startingUp = false;
        }, 2500);

        setInterval(() => {
            this.loopCursorTick();
        }, 600);
        this.createInputLineBackground();
        this.resetInputLine();
    }

    graduallyCreateStartingContent(text, font, xPos = 0) {
        this.addToTerminalContent(text, font, 0.12, xPos);
    }

    createCaretTick() {
        const cursorGeometry = new THREE.BoxGeometry(0.2, 0.02, 0.01);
        const cursorMaterial = new THREE.MeshStandardMaterial({ color: 0x20C20E });
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

    createIFrame(){
        
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

    addToTerminalContent(textGiven, fontGiven = this.properties.defaultFont, customFontSize = 0.12, customXPos = 0) {
        let newLine;

        if (textGiven == undefined) {
            console.log("text given is not valid.")
            return;
        }
        const textWithTabs = textGiven.replace(/\n/g, '\n          ');

        const textGeometry = new TextGeometry(textWithTabs, {
            font: fontGiven,
            size: customFontSize,
            height: 0.1,
        });
        const textMaterial = new THREE.MeshPhongMaterial({ color: 0x20C20E });
        newLine = new THREE.Mesh(textGeometry, textMaterial);
        newLine.position.x = customXPos;
        newLine.receiveShadow = false;

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

    updateInputField() {
        if (this.inputFieldTextObject != undefined)
            this.inputFieldGroup.remove(this.inputFieldTextObject);

        const textGeometry = new TextGeometry(this.inputFieldContent, {
            font: this.properties.defaultFont,
            size: 0.2,
            height: 0.01,
        });
        const textMaterial = new THREE.MeshStandardMaterial({ color: 0x20C20E });
        this.inputFieldTextObject = new THREE.Mesh(textGeometry, textMaterial);
        this.inputFieldGroup.add(this.inputFieldTextObject);
        this.inputFieldTextObject.updateMatrixWorld();

        this.inputFieldTextObject.geometry.computeBoundingBox();
        const boundingBox = this.inputFieldTextObject.geometry.boundingBox;
        const centerX = (boundingBox.min.x + boundingBox.max.x) / 2;
        const defaultOffset = 0.2;
        const xPos = centerX + (boundingBox.max.x / 2) + defaultOffset;
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
        const dirArray = data.directories.map(directory => {
            return directory.slice(10);
        });
        this.addToTerminalContent("Found " + dirArray.length + " subdirectories in " + this.properties.currentDirectory);

        for (let i = 0; i < dirArray.length; i++) {
            let dirName = dirArray[i];
            let lastIndex = dirName.lastIndexOf("/");
            let result = dirName.substring(lastIndex + 1);
            const formattedPath = result.replace(/\//g, "\\");
            this.addToTerminalContent(" - " + formattedPath + "\\");
        }

        //Files
        const fileArray = data.files.map(files => {
            return files.slice(10);
        });
        this.addToTerminalContent("Found " + fileArray.length + " file(s) in " + this.properties.currentDirectory);
        for (let i = 0; i < fileArray.length; i++) {
            let fileName = fileArray[i];
            let lastIndex = fileName.lastIndexOf("/");
            let result = fileName.substring(lastIndex + 1);
            const formattedName = result.replace(/\//g, "\\");
            this.addToTerminalContent(" - " + formattedName);
        }
    }

    resetInputLine() {
        this.reformatDirectory(this.properties.currentDirectory);
        this.inputFieldContent = this.properties.formattedDir;
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

    reformatDirectory(unformattedDir) {
        let formattedDir = unformattedDir;
        formattedDir += ">";
        this.properties.formattedDir = formattedDir;
    }
}