import * as THREE from 'three';
import PortfolioContent from './PortfolioContent.js';
import TerminalProperties from './TerminalProperties.js';
import PortfolioProperties from './PortfolioProperties.js';
import TerminalFrontEnd from './TerminalFrontEnd.js';
import TerminalBackEnd from './TerminalBackEnd.js';
import FontManager from './FontManager.js';

export default class MainScene extends THREE.Scene {
    terminalProperties;
    portfolioProperties;
    frontend;
    backend;

    fontManager;

    currentCommand = "";
    portfolioContent;
    backgroundPlane
    userIsTyping;

    constructor() {
        super()
        this.terminalProperties = new TerminalProperties();
        this.portfolioProperties = new PortfolioProperties();

        this.fontManager = new FontManager(this.terminalProperties, this.portfolioProperties);
        this.frontend = new TerminalFrontEnd(this, this.terminalProperties);
        this.backend = new TerminalBackEnd(this.terminalProperties);

        this.portfolioContent = new PortfolioContent(this, this.portfolioProperties);
        (async () => {
            try {
                await this.fontManager.loadFonts();
                this.frontend.createTerminal();
                this.portfolioContent.createWindow();
            } catch (error) {
                throw (error);
            }
        })();

        this.terminalProperties.currentDirectory = `MainDrive`;

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
            if (trimmedString == this.terminalProperties.currentDirectory)
                return;
            this.submitContent();
        }

        if (this.terminalProperties.specialKeys.includes(key))
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
        if (!this.terminalProperties.validCommandsMap.has(this.currentCommand)) {
            this.frontend.addToTerminalContent("'" + this.currentCommand + "'" + this.terminalProperties.errorMessageInvalidCommand);
            this.frontend.addToTerminalContent(this.terminalProperties.helpMessage);
            return false;
        }

        return true;
    }

    moveIntoDirectory(newDir) {
        this.terminalProperties.currentDirectory = newDir;
    }

    executeCommand() {
        const path = this.pathUsedAsTarget.substring(2).trim();
        switch (this.currentCommand) {
            case "help":
                this.frontend.executeHelpCommand();
                break;
            //List all subdirectories of current directory.
            case "dir":
                (async () => {
                    try {
                        //TODO: implement dir for subdirectories
                        const data = await this.backend.recursivelySearchDirectories(this.terminalProperties.currentDirectory);
                        this.frontend.executeDirCommand(data);
                    } catch (error) {
                        throw (error);
                    }
                })();
                break;
            case "cd":
                if (path !== "../") {
                    this.cdDown(path);
                }
                else this.cdUp();
                break;
            case "type":
                let fileName = this.extractDataFromInput("path");
                if (fileName === undefined) {
                    let errorMessage = "File does not exist."
                    this.frontend.addToTerminalContent(errorMessage);
                    return;
                }
                let terminalInfo = "Retrieving contents of file '" + fileName + "'...";
                this.frontend.addToTerminalContent(terminalInfo);
                const filePath = this.terminalProperties.currentDirectory + "/" + fileName;

                (async () => {
                    try {
                        const fileData = await this.backend.readFile(filePath);
                        this.portfolioContent.createText(fileData);
                    }
                    catch (error) {
                        console.error("Error reading file:", error);
                    }
                })();

                break;
            case "clear":
                this.frontend.clearTerminal();
                break;
        }
    }

    extractDataFromInput(dataToExtract) {
        switch (dataToExtract) {
            case "command":
                return this.pathUsedAsTarget.split(" ")[0];
            case "path":
                return this.pathUsedAsTarget.split(" ")[1];
        }
    }

    cdUp() {
        if (this.terminalProperties.currentDirectory == this.terminalProperties.rootDirectory) {
            console.log("already at root.")
            return;
        }

        //Move up to parent directory.
        this.backend.moveUpDirectory();
        this.frontend.resetInputLine();
        this.frontend.updateInputField();
    }

    async cdDown(path) {
        try {
            //Moving down into directory.
            const pathToCheck = this.terminalProperties.currentDirectory + "/" + path;
            const data = await this.backend.checkDirectory(pathToCheck);
            console.log(data);
            if (data.Valid === false) {
                this.frontend.addToTerminalContent(this.errorMessageInvalidDirectory);
                return data;
            }

            //Extract directory from path
            let targetSubDir = this.extractDataFromInput("path");
            if (targetSubDir === undefined || targetSubDir === "") {
                this.frontend.addToTerminalContent("No path provided. Aborting.");
            }

            this.backend.moveDownDirectory(data.Name);
            this.frontend.reformatDirectory(data.Name);
            this.frontend.resetInputLine();
        } catch (error) {
            console.error(error);
        }
    }
}