import * as THREE from 'three';
import PortfolioContent from './PortfolioContent.js';
import TerminalProperties from './TerminalProperties.js';
import TerminalFrontEnd from './TerminalFrontEnd.js';
import TerminalBackEnd from './TerminalBackEnd.js';

export default class MainScene extends THREE.Scene {
    terminalProps;
    frontend;
    backend;

    currentCommand = "";
    portfolioContent;
    backgroundPlane
    userIsTyping;

    constructor() {
        super()
        this.terminalProps = new TerminalProperties();
        this.frontend = new TerminalFrontEnd(this, this.terminalProps);
        this.backend = new TerminalBackEnd();

        this.portfolioContent = new PortfolioContent(this);
        this.terminalProps.currentDirectory = `./C:`;

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
            if (trimmedString == this.terminalProps.currentDirectory)
                return;
            this.submitContent();
        }

        if (this.terminalProps.specialKeys.includes(key))
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
        let command = this.pathUsedAsTarget.split(" ")[0];
        this.currentCommand = command.toLowerCase();

        //If array does not contain command, it is invalid. Throw error message to terminal.
        if (!this.terminalProps.validCommandsMap.has(this.currentCommand)) {
            this.frontend.addToTerminalContent("'" + this.currentCommand + "'" + this.terminalProps.errorMessageInvalidCommand);
            this.frontend.addToTerminalContent(this.terminalProps.helpMessage);
            return false;
        }

        return true;
    }

    moveIntoDirectory(newDir) {
        this.terminalProps.currentDirectory = newDir;
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
                        console.log(this.terminalProps.currentDirectory);

                        //TODO: implement dir for subdirectories
                        const data = await this.backend.recursivelySearchDirectories(`./C:`);
                        this.frontend.executeDirCommand(data);
                    } catch (error) {
                        console.error("Error fetching directories:", error);
                    }
                })();
                break;
            //Move into specified directory. Also used for moving up in directories.
            case "cd":
                //First check if is moving up.
                const path = this.pathUsedAsTarget.substring(2).trim();
                //TODO: check if current directory is C:\>.
                if (path == "../") {
                    console.log(this.terminalProps.currentDirectory);
                    if (this.terminalProps.currentDirectory == "./C:") {
                        console.log("already at root.")
                        return;
                    }

                    //Move up to parent directory.
                    this.backend.moveUpDirectory();
                    this.frontend.resetInputLine();
                    this.frontend.updateInputField();
                    return;
                }

                //Moving down into directory.
                (async () => {
                    try {
                        //Check if directory provided is valid.
                        console.log(this.frontend.inputFieldContent);
                        const validDirectory = await this.backend.checkDirectory(this.terminalProps.currentDirectory);
                        if (validDirectory) {
                            let formattedDir = this.frontend.reformatDirectory(this.terminalProps.currentDirectory);
                            // console.log("Unformatted: ", this.terminalProps.currentDirectory, ". Formatted:", formattedDir);
                            this.terminalProps.formattedDir = formattedDir;
                            this.frontend.resetInputLine(formattedDir);
                            this.frontend.inputFieldContent = "C:\>";
                        } else {
                            this.frontend.addToTerminalContent(this.errorMessageInvalidDirectory);
                        }
                    } catch (error) {
                        throw (error);
                    }
                })();
                break;
            case "cat":
                break;
            case "clear":
                this.frontend.clearTerminal();
                break;
        }
    }
}