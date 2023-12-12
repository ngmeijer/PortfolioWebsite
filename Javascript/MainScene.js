import * as THREE from 'three';
import PortfolioContent from './PortfolioContent.js';
import TerminalProperties from './TerminalProperties.js';
import TerminalFrontEnd from './TerminalFrontEnd.js';
import TerminalBackEnd from './TerminalBackEnd.js';

export default class MainScene extends THREE.Scene {
    terminalProps;
    frontend;
    backend;

    currentDirectory = "";
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

        this.currentDirectory = this.terminalProps.defaultTerminalLine;
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
            if (trimmedString == this.currentDirectory)
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

    resetTerminalLine() {
        this.frontend.inputFieldContent = this.terminalProps.defaultTerminalLine + this.terminalProps.addedToTerminalPath;
        this.frontend.updateInputField();
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
            this.addToTerminalContent("'" + this.currentCommand + "'" + this.terminalProps.errorMessageInvalidCommand);
            return false;
        }

        //If the command is "dir" or "help", input is valid and we should not check for any path.
        if (this.currentCommand.toLowerCase() == "dir" || this.currentCommand.toLowerCase() == "help")
            return true;

        this.givenDirectory = resultString.split(" ")[1];
        //Path is not valid.
        if (this.givenDirectory == undefined || this.givenDirectory == "") {
            //this.addToTerminalContent(this.errorMessageInvalidDirectory);
            return false;
        }

        return true;
    }

    async recursivelySearchDirectories() {
        try {
            const response = await fetch(`https://nilsmeijer.com/Terminal/ListAllDirectories.php?path=${encodeURIComponent(`Terminal`)}`);
            const data = await response.json();

            if (import.meta.env.MODE === 'development') {
                // console.log('Directories:', data.directories);
                // console.log('files:', data.files);
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
        console.log("command:", this.currentCommand);
        switch (this.currentCommand) {
            case "help":
                this.frontend.addToTerminalContent("Valid commands are:")
                const map = this.terminalProps.validCommandsMap;
                const keyArray = Array.from(map.keys())
                const valueArray = Array.from(map.values());
                for (let i = 0; i < keyArray.length; i++) {
                    this.frontend.addToTerminalContent("     " + keyArray[i] + " - " + valueArray[i]);
                }
                break;
            //List all subdirectories of current root directory.
            case "dir":
                (async () => {
                    try {
                        const data = await this.recursivelySearchDirectories();

                        //Directories
                        this.frontend.addToTerminalContent("Subdirectories of " + this.currentDirectory);
                        const dirArray = data.directories.map(directory => {
                            // Replace everything before "/Dir" with an empty string
                            return directory.replace(/.*\/Terminal/, '');
                        });
                        for (let i = 0; i < dirArray.length; i++) {
                            let dirName = dirArray[i];
                            this.frontend.addToTerminalContent(" - " + dirName);
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
                console.log(this.currentCommand);
                this.addToTerminalContent(this.errorMessageInvalidDirectory);
                break;
            case "cat":
                break;
        }
    }

    update() {

    }
}