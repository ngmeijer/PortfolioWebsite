import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export default class TerminalFrontEnd {
    scene;

    properties;
    inputFieldContent = "";
    startingUp;

    autocompleteActive;

    terminalLineParent;
    inputFieldLine;

    constructor(scene, properties) {
        this.scene = scene;
        this.properties = properties;
        this.startingUp = true;

        this.terminalLineParent = document.getElementById('terminal-content');
        this.inputFieldLine = document.getElementById('input-field');
    }

    createTerminal() {
        this.inputFieldLine.textContent = this.properties.defaultTerminalLine;

        const lines = this.properties.asciiArt.split('\n');

        let delay = 0;
        // Print each line separately
        lines.forEach(line => {
            setTimeout(() => this.graduallyCreateStartingContent(line, "ascii", "pre"), delay);
            delay += 100;
        });

        setTimeout(() => this.graduallyCreateStartingContent(this.properties.customDefaultText[0]), 1000);
        setTimeout(() => this.graduallyCreateStartingContent(this.properties.customDefaultText[1]), 1500);
        setTimeout(() => this.graduallyCreateStartingContent(this.properties.customDefaultText[2]), 1700);
        setTimeout(() => this.graduallyCreateStartingContent(this.properties.customDefaultText[3]), 2200);
        setTimeout(() => {
            this.graduallyCreateStartingContent(this.properties.helpMessage);
            this.startingUp = false;
        }, 2500);

        this.resetInputLine();
    }

    graduallyCreateStartingContent(text, className, element) {
        this.addToTerminalContent(text, className, element);
    }

    addToTerminalContent(textGiven, className = "terminal-line", elementTag = "div") {
        if (textGiven === undefined || textGiven === "") {
            console.log("text given is not valid.")
            return;
        }
        let newLineElement = document.createElement(elementTag);
        newLineElement.className = className;

        textGiven = textGiven.replace(/\n/g, "<br>");
        textGiven = textGiven.replace(/\t/g, "&nbsp;&nbsp;&nbsp;");

        newLineElement.innerHTML = textGiven;
        this.terminalLineParent.appendChild(newLineElement);
    }

    executeHelpCommand() {
        this.addToTerminalContent("Valid commands are:")
        const map = this.properties.validCommandsMap;
        const keyArray = Array.from(map.keys())
        const valueArray = Array.from(map.values());

        for (let i = 0; i < keyArray.length; i++) {
            let messageText = `<pre>    ${keyArray[i]} - ${valueArray[i]}</pre>`
            this.addToTerminalContent(messageText);
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
        this.inputFieldLine.value = this.properties.formattedDir;
    }

    clearTerminal() {
        this.terminalLineParent.replaceChildren();
    }

    reformatDirectory(unformattedDir) {
        let formattedDir = unformattedDir;
        formattedDir += ">";
        this.properties.formattedDir = formattedDir;
    }
}