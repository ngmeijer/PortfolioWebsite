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
        this.frontend = new TerminalFrontEnd(this);
        this.frontend.scene = this;
        this.frontend.properties = this.terminalProps;

        this.backend = new TerminalBackEnd();

        this.portfolioContent = new PortfolioContent();

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
            if (trimmedString == this.frontend.currentDirectory)
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

        let isValid = this.checkValidInput();
        this.frontend.resetInputLine();
        if (!isValid)
            return;

        let shouldProceed = this.executeCommand();
    }

    checkValidInput() {
        //Find the last >.
        let bracketIndex = this.frontend.inputFieldContent.indexOf(">");
        let resultString = "";
        if (bracketIndex == -1) {
            return false;
        }

        //Retrieve the full input
        resultString = this.frontend.inputFieldContent.substring(bracketIndex + 1).trim();

        //Retrieve the command
        let command = resultString.split(" ")[0];
        this.currentCommand = command.toLowerCase();

        //If array does not contain command, it is invalid. Throw error message to terminal.
        if (!this.terminalProps.validCommandsMap.has(this.currentCommand)) {
            console.log()
            this.frontend.addToTerminalContent("'" + this.currentCommand + "'" + this.terminalProps.errorMessageInvalidCommand);
            return false;
        }

        let commandLowerCase = this.currentCommand.toLowerCase();
        //If the command is "dir" or "help", input is valid and we should not check for any path.
        if (commandLowerCase == "dir"
            || commandLowerCase == "help"
            || commandLowerCase == "clear")
            return true;

        this.givenDirectory = resultString.split(" ")[1];
        //Path is not valid.
        if (this.givenDirectory == undefined || this.givenDirectory == "") {
            //this.addToTerminalContent(this.errorMessageInvalidDirectory);
            return false;
        }

        return true;
    }

    moveIntoDirectory(newDir) {
        this.frontend.currentDirectory = newDir;
    }

    executeCommand() {
        switch (this.currentCommand) {
            case "help":
                this.frontend.executeHelpCommand();
                break;
            //List all subdirectories of current root directory.
            case "dir":
                (async () => {
                    try {
                        const data = await this.backend.recursivelySearchDirectories();
                        this.frontend.executeDirCommand(data);
                    } catch (error) {
                        console.error("Error fetching directories:", error);
                    }
                })();
                break;
            //Move into specified directory.
            case "cd":
                (async () => {
                    try {
                        const canMove = await this.backend.checkDirectory(this.givenDirectory);
                        console.log(canMove);
                        if (canMove) {
                            const removedBracket = this.frontend.currentDirectory.slice(0, -1);
                            this.frontend.currentDirectory = removedBracket + (this.givenDirectory + ">");
                            this.frontend.resetInputLine();
                            console.log("moved to directory.")
                        }
                    } catch (error) {
                        console.error("Error checking for specific directory");
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

    update() {

    }
}