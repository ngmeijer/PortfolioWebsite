import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import PortfolioContent from './PortfolioContent.js';
import TerminalProperties from './TerminalProperties.js';

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
        console.log(this.terminalProps.validCommandsMap);
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
            const lastChar = this.inputFieldContent.charAt(this.inputFieldContent.length - 1);
            if (lastChar == ">")
                return;

            event.preventDefault();
            this.inputFieldContent = this.inputFieldContent.substring(0, this.inputFieldContent.length - 1);
            this.updateInputField();
            return;
        }

        if (key == "Enter") {
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
        let width = 0;
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

                const boundingBox = new THREE.Box3().setFromObject(this.inputFieldTextObject);
                const textWidth = boundingBox.max.x - boundingBox.min.x;
                console.log(boundingBox);

                let center = new THREE.Vector3(0, 0, 0);
                boundingBox.getCenter(center);
                console.log(center.x);
                //this.caretTick.position.x = center.x;
                //this.cursorTick.position.x = 0;
                //this.cursorTick.position.x = boundingBox.getCenter(center).x + textWidth;
                //console.log('Text Width:', textWidth);
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
        console.log(this.terminalProps.validCommandsMap);
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

    recursivelySearchDirectories(specificDirectory = "Drive:/") {
        let directories = [];

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
                for (let i = 0; i < this.terminalProps.validCommandsMap.length; i++) {
                    this.addToTerminalContent(" - " + this.terminalProps.validCommandsMap[i]);
                }
                break;
            //List all subdirectories of current root directory.
            case "dir":
                let directories = this.recursivelySearchDirectories();
                this.addToTerminalContent("Directory of " + this.currentDirectory)
                for (let i = 0; i < directories.length; i++) {
                    this.addToTerminalContent(" - " + directories[i]);
                }
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