import * as THREE from 'three';
import WebsiteContent from './WebsiteContent.js';
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

        this.portfolioContent = new WebsiteContent(this, this.portfolioProperties);
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

        //Get input
        const key = event.key;

        //Check if should delete character
        if (this.checkCharacterDelete(event, key) === true)
            return;

        //Check if content should and can be submitted.
        if (key === "Enter") {
            this.frontend.addToTerminalContent(this.frontend.inputFieldContent);

            let isValid = this.checkIfCommandIsValid();

            if (isValid)
                this.executeCommand();

            this.frontend.resetInputLine();
        }

        //Prevent adding to input field if key is one of special keys.
        if (this.terminalProperties.specialKeys.includes(key))
            return;

        this.addToInputField(key);
    }

    checkCharacterDelete(event, key) {
        if (key == "Backspace") {
            event.preventDefault();
            if (this.frontend.inputFieldContent.endsWith(">")) {
                console.log("Current character is >")
                return true;
            }

            const newContent = this.frontend.inputFieldContent.slice(0, -1);
            this.frontend.inputFieldContent = newContent;
            this.frontend.updateInputField();
            return true;
        }

        return false;
    }

    addToInputField(key) {
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

    checkIfCommandIsValid() {
        //Find the last >.
        let bracketIndex = this.frontend.inputFieldContent.indexOf(">");
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
                this.findAndReadFile();
                break;
            case "clear":
                this.frontend.clearTerminal();
                break;
        }
    }

    async findAndReadFile() {
        let fileName = this.extractDataFromInput("path");
        (async () => {
            try {
                const filePath = this.terminalProperties.currentDirectory + "\\" + fileName;
                console.log(filePath);
                const fileData = await this.backend.readFile(filePath);
                console.log(fileData);
                
                if (fileData.FileData === "Invalid") {
                    //this.frontend.addToTerminalContent(this.terminalProperties.errorMessageInvalidFile);
                    return;
                }

                //Succeeded reading the file and displaying contents
                let successionMessage = `${this.terminalProperties.messageOnCommandType[0]} '${fileName}' ${this.terminalProperties.messageOnCommandType[1]}`;
                this.frontend.addToTerminalContent(successionMessage);
                this.portfolioContent.setTitle(fileData.FileName);
                this.portfolioContent.createText(fileData.FileData);
            }
            catch (error) {
                this.frontend.addToTerminalContent(this.terminalProperties.errorMessageInvalidFile);
            }
        })();
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