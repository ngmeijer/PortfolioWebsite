import * as THREE from 'three';
import PortfolioContent from './PortfolioContent.js';
import TerminalProperties from './TerminalProperties.js';
import TerminalFrontEnd from './TerminalFrontEnd.js';
import TerminalBackEnd from './TerminalBackEnd.js';

export default class MainScene extends THREE.Scene {
    properties;
    frontend;
    backend;

    currentCommand = "";
    portfolioContent;
    backgroundPlane
    userIsTyping;

    constructor() {
        super()
        this.properties = new TerminalProperties();
        this.frontend = new TerminalFrontEnd(this, this.properties);
        this.backend = new TerminalBackEnd(this.properties);

        this.portfolioContent = new PortfolioContent(this);
        this.properties.currentDirectory = `MainDrive`;

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(0, 0, 15);
        dirLight.castShadow = true;
        this.add(dirLight);

        this.onDocumentKeyPress = this.onDocumentKeyPress.bind(this);
    }

    onDocumentKeyPress(event) {
        if (this.frontend.startingUp == true) {
            return;
        }

        this.userIsTyping = true;
        const key = event.key;
        if (key == "Backspace") {
            event.preventDefault();
            if (this.frontend.inputFieldContent.endsWith(">")) {
                console.log("Current character is >")
                return;
            }

            const newContent = this.frontend.inputFieldContent.slice(0, -1);
            this.frontend.inputFieldContent = newContent;
            this.frontend.updateInputField();
            return;
        }

        if (key == "Enter") {
            let trimmedString = this.frontend.inputFieldContent.trim();
            if (trimmedString == this.properties.currentDirectory)
                return;
            this.submitContent();
        }

        if (this.properties.specialKeys.includes(key))
            return;

        this.frontend.inputFieldContent += key;
        this.frontend.updateInputField();
    }

    onDocumentKeyRelease() {
        this.userIsTyping = false;
    }

    checkIfCapitalLetter(event, character) {
        if (event.getModifierState("CapsLock")) {
            character = character.toUpperCase();
        }
    }

    submitContent() {
        this.frontend.addToTerminalContent(this.frontend.inputFieldContent);
        let isValid = this.checkIfCommandIsValid();
        this.frontend.resetInputLine();
        if (!isValid)
            return;

        let shouldProceed = this.executeCommand();
    }

    checkIfCommandIsValid() {
        //Find the last >.
        let bracketIndex = this.frontend.inputFieldContent.indexOf(">");
        let resultString = "";
        if (bracketIndex == -1) {
            return false;
        }

        //Retrieve the full input
        this.pathUsedAsTarget = this.frontend.inputFieldContent.substring(bracketIndex + 1).trim();

        //Retrieve the command
        let command = this.extractDataFromInput("command");
        this.currentCommand = command.toLowerCase();

        //If array does not contain command, it is invalid. Throw error message to terminal.
        if (!this.properties.validCommandsMap.has(this.currentCommand)) {
            this.frontend.addToTerminalContent("'" + this.currentCommand + "'" + this.properties.errorMessageInvalidCommand);
            this.frontend.addToTerminalContent(this.properties.helpMessage);
            return false;
        }

        return true;
    }

    moveIntoDirectory(newDir) {
        this.properties.currentDirectory = newDir;
    }

    executeCommand() {
        switch (this.currentCommand) {
            case "help":
                this.frontend.executeHelpCommand();
                break;
            //List all subdirectories of current directory.
            case "dir":
                (async () => {
                    try {
                        console.log(this.properties.currentDirectory);

                        //TODO: implement dir for subdirectories
                        const data = await this.backend.recursivelySearchDirectories(this.properties.currentDirectory);
                        this.frontend.executeDirCommand(data);
                    } catch (error) {
                        throw(error);
                    }
                })();
                break;
            case "cd":
                const path = this.pathUsedAsTarget.substring(2).trim();
                let movingUp = this.cdUp(path);

                if (!movingUp)
                    this.cdDown(path);
                break;
            case "cat":
                break;
            case "clear":
                this.frontend.clearTerminal();
                break;
        }
    }

    cdUp(path) {
        if (path == "../") {
            console.log(this.properties.currentDirectory);
            if (this.properties.currentDirectory == this.properties.rootDirectory) {
                console.log("already at root.")
                return;
            }

            //Move up to parent directory.
            this.backend.moveUpDirectory();
            console.log(this.properties.currentDirectory);
            this.frontend.resetInputLine();
            this.frontend.updateInputField();
            return true;
        } else return false;
    }

    extractDataFromInput(dataToExtract) {
        switch (dataToExtract) {
            case "command":
                return this.pathUsedAsTarget.split(" ")[0];
            case "path":
                return this.pathUsedAsTarget.split(" ")[1];
        }
    }

    cdDown() {
        //Moving down into directory.
        (async () => {
            try {
                //Extract directory from path
                let targetSubDir = this.extractDataFromInput("path");
                let currentMainDir = this.properties.currentDirectory;

                const validDirectory = await this.backend.checkDirectory(this.properties.currentDirectory);
                if (!validDirectory) {
                    this.frontend.addToTerminalContent(this.errorMessageInvalidDirectory);
                    return;
                }

                this.backend.moveDownDirectory(this.properties.currentDirectory, targetSubDir);
                this.frontend.reformatDirectory(this.properties.currentDirectory);
                this.frontend.resetInputLine();
                console.log(this.properties.currentDirectory);
            } catch (error) {
                throw (error);
            }
        })();
    }
}