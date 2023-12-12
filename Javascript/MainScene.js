import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import PortfolioContent from './PortfolioContent.js';
import TerminalProperties from './TerminalProperties.js';

// const fs = require('fs');
// const path = require('path');

export default class MainScene extends THREE.Scene {
    fontLoader;
    inputFieldTextObject;
    inputFieldContent = "";
    inputFieldGroup;
    terminalContentGroup;
    terminalProps;

    currentDirectory = "";
    currentCommand = "";
    portfolioContent;
    cursorVisible = true;
    caretTick;
    backgroundPlane
    userIsTyping;

    constructor() {
        super()
        this.fontLoader = new FontLoader();
        this.inputFieldGroup = new THREE.Group();
        this.terminalContentGroup = new THREE.Group();
        this.terminalProps = new TerminalProperties();

        this.add(this.inputFieldGroup);
        this.add(this.terminalContentGroup);

        this.inputFieldGroup.position.set(-6, -3.5, 0);
        this.terminalContentGroup.position.set(-6, -2.5, 0);
        this.inputFieldContent = this.terminalProps.defaultTerminalLine;

        //this.addToTerminalContent(this.asciiArt, 0.2);
        this.addToTerminalContent(this.terminalProps.customDefaultText[0])
        this.addToTerminalContent(this.terminalProps.customDefaultText[1])
        this.addToTerminalContent("Enter 'help' to show a list of available commands.")
        this.currentDirectory = this.terminalProps.defaultTerminalLine;
        this.portfolioContent = new PortfolioContent();
        this.createCursorTick();
        setInterval(() => {
            this.loopCursorTick();
        }, 600);
        this.updateInputField();
        this.createBackground();

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
        directionalLight.position.set(1, 1, 1).normalize();
        this.add(directionalLight);

        this.onDocumentKeyPress = this.onDocumentKeyPress.bind(this);
    }

    onDocumentKeyPress(event) {
        this.userIsTyping = true;
        const key = event.key;
        if (key == "Backspace") {
            event.preventDefault();
            if (this.inputFieldContent.endsWith(">")) {
                console.log("Current character is >")
                return;
            }

            const newContent = this.inputFieldContent.slice(0, -1);
            this.inputFieldContent = newContent;
            this.updateInputField();
            return;
        }

        if (key == "Enter") {
            let trimmedString = this.inputFieldContent.trim();
            if (trimmedString == this.currentDirectory)
                return;
            this.submitContent();
        }

        if (this.terminalProps.specialKeys.includes(key))
            return;

        this.inputFieldContent += key;
        this.updateInputField();
    }

    onDocumentKeyRelease() {
        this.userIsTyping = false;
    }

    createCursorTick() {
        const cursorGeometry = new THREE.BoxGeometry(0.02, 0.4, 0.02);
        const cursorMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: new THREE.Color(0xffffff), emissiveIntensity: 1000 });
        this.caretTick = new THREE.Mesh(cursorGeometry, cursorMaterial);
        this.inputFieldGroup.add(this.caretTick);
        this.caretTick.position.set(0.6, 0.1, 0);
    }

    createBackground() {
        const backgroundGeometry = new THREE.BoxGeometry(100, 0.4, 100);
        const backgroundMaterial = new THREE.MeshPhongMaterial({ color: 0x322222 });
        this.backgroundPlane = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        this.backgroundPlane.position.set(0.6, 0.1, -0.1);
        this.backgroundPlane.rotateOnAxis(new THREE.Vector3(1, 0, 0), 90);
        this.terminalContentGroup.add(this.backgroundPlane);
    }

    checkIfCapitalLetter(event, character) {
        if (event.getModifierState("CapsLock")) {
            character = character.toUpperCase();
        }
    }

    submitContent() {
        this.addToTerminalContent(this.inputFieldContent);

        let isValid = this.checkValidInput();
        this.resetTerminalLine();
        if (!isValid)
            return;

        let shouldProceed = this.executeCommand();
    }

    searchFolder(directory, searchTerm) {
        try {
            const files = fs.readdirSync(directory);
            console.log("reading.")

            for (const file of files) {
                const filePath = path.join(directory, file);
                const stats = fs.statSync(filePath);

                if (stats.isDirectory()) {
                    console.log("is directory.")
                    // If it's a directory, recursively search inside it
                    searchFolder(filePath, searchTerm);
                } else if (stats.isFile() && file.includes(searchTerm)) {
                    // If it's a file and contains the search term, do something with it
                    console.log(filePath);
                }
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }


    addToTerminalContent(textGiven, customFontSize = 0.2) {
        let newLine;
        this.fontLoader.load(
            './static/fonts/helvetiker_regular.typeface.json',
            (font) => {
                const textGeometry = new TextGeometry(textGiven, {
                    font,
                    size: customFontSize,
                    height: 0.01,
                });
                newLine = new THREE.Mesh(textGeometry);

                this.terminalContentGroup.traverse(function (object) {
                    if (object.type != "Group")
                        object.position.y += 0.35;
                });

                this.terminalContentGroup.add(newLine);
            });
    }

    resetTerminalLine() {
        this.inputFieldContent = this.terminalProps.defaultTerminalLine + this.terminalProps.addedToTerminalPath;
        this.updateInputField();
    }

    updateInputField() {
        this.inputFieldGroup.remove(this.inputFieldTextObject);
        this.fontLoader.load(
            './static/fonts/helvetiker_regular.typeface.json',
            (font) => {
                const textGeometry = new TextGeometry(this.inputFieldContent, {
                    font,
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
            });
    }

    checkValidInput() {
        //Find the last >.
        let bracketIndex = this.inputFieldContent.indexOf(">");
        let resultString = "";
        if (bracketIndex == -1) {
            return false;
        }

        //Retrieve the full input
        resultString = this.inputFieldContent.substring(bracketIndex + 1).trim();

        //Retrieve the command
        this.currentCommand = resultString.split(" ")[0];
        //If array does not contain command, it is invalid. Throw error message to terminal.
        if (!this.terminalProps.validCommandsMap.has(this.currentCommand)) {
            this.addToTerminalContent("'" + this.currentCommand + "'" + this.terminalProps.errorMessageInvalidCommand);
            return false;
        }

        if (this.currentCommand.toLowerCase() == "dir" || this.currentCommand.toLowerCase() == "help")
            return true;

        this.givenDirectory = resultString.split(" ")[1];
        //Path is not valid.
        if (this.givenDirectory == undefined || this.givenDirectory == "") {
            this.addToTerminalContent(this.errorMessageInvalidDirectory);
            return false;
        }

        //Check if path exists.
        if (!this.terminalProps.validLayer1Directories.includes()) {
            this.addToTerminalContent(this.errorMessageInvalidDirectory);
            return false;
        }

        return true;
    }

    async recursivelySearchDirectories() {
        try {
            const response = await fetch(`https://nilsmeijer.com/Terminal/ListAllDirectories.php?path=${encodeURIComponent(`Terminal`)}`);
            const data = await response.json();

            if (import.meta.env.MODE === 'development') {
                console.log('Directories:', data.directories);
                console.log('files:', data.files);
            }

            const dirArray = Object.values(data.directories);
            const fileArray = Object.values(data.files);
            return new Object({ directories: dirArray, files: fileArray });
        } catch (error) {
            if (import.meta.env.MODE === 'development') {
                console.log("Error fetching directories:", error);
            }
            throw error;
        }
    }

    getDirectory() {
        if (!this.validLayer1Directories.includes(this.givenDirectory)) {
            this.addToTerminalContent(this.errorMessageInvalidDirectory);
            return "invalid";
        }
        else return this.givenDirectory;
    }

    moveIntoDirectory(newDir) {
        this.currentDirectory = newDir;
    }

    executeCommand() {
        switch (this.currentCommand) {
            case "help":
                this.addToTerminalContent("Valid commands are:")
                const map = this.terminalProps.validCommandsMap;
                const keyArray = Array.from(map.keys())
                const valueArray = Array.from(map.values());
                for (let i = 0; i < keyArray.length; i++) {
                    this.addToTerminalContent("     " + keyArray[i] + " - " + valueArray[i]);
                }
                break;
            //List all subdirectories of current root directory.
            case "dir":
                (async () => {
                    try {
                        const data = await this.recursivelySearchDirectories();
                        
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
                    } catch (error) {
                        console.error("Error fetching directories:", error);
                    }
                })();
                break;
            //Move into specified directory.
            case "cd":
                // let newDirectory = this.recursivelySearchDirectories();
                // if (newDirectory == "invalid") {
                //     return;
                // }
                this.moveIntoDirectory(newDirectory);
                break;
            case "cat":
                break;
        }
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

    update() {

    }
}