import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export default class TestScene extends THREE.Scene {
    cube;
    fontLoader;
    inputFieldTextObject;
    inputFieldContent;
    inputFieldGroup;
    terminalContentGroup;
    specialKeys = ["Shift", "CapsLock", "Enter", "Control", "ContextMenu", "Tab", "Alt",
        "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
        "Insert", "Home", "PageUp", "PageDown", "Delete", "End",
        "Numlock", "ScrollLock", "Pause", "Escape"]
    defaultTerminalLine = "C:\\Portfolio>";

    constructor() {
        super()
        this.inputFieldContent = this.defaultTerminalLine;
        this.fontLoader = new FontLoader();
        this.inputFieldGroup = new THREE.Group();
        this.terminalContentGroup = new THREE.Group();
        this.add(this.inputFieldGroup);
        this.add(this.terminalContentGroup);

        this.inputFieldGroup.position.set(-6, -3.5, 0);
        this.terminalContentGroup.position.set(-6, -2.5, 0);

        this.updateInputField();
        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        this.terminalContentGroup.add(cube);

        this.onDocumentKeyPress = this.onDocumentKeyPress.bind(this);
    }

    onDocumentKeyPress(event) {
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

        if (this.specialKeys.includes(key))
            return;

        this.inputFieldContent += key;
        this.updateInputField();
    }

    checkIfCapitalLetter(event, character) {
        if (event.getModifierState("CapsLock")) {
            character = character.toUpperCase();
        }
    }

    checkForSpecialSigns(character) {
        switch (character) {
            case "1":
                character = "!";
                break;
            case "2":
                character = "@";
                break;
            case "3":
                character = "#";
                break;
            case "4":
                character = "$";
                break;
            case "5":
                character = "%";
                break;
            case "6":
                character = "^";
                break;
            case "7":
                character = "&";
                break;
            case "8":
                character = "*";
                break;
            case "9":
                character = "(";
                break;
            case "0":
                character = ")";
                break;
            default:
                return character;
        }

        return character;
    }

    submitContent() {
        this.addToTerminalContent(this.inputFieldContent);
        this.createDefaultTerminalLine();
    }

    addToTerminalContent(textGiven) {
        let newLine;
        this.fontLoader.load(
            './static/fonts/helvetiker_regular.typeface.json',
            (font) => {
                const textGeometry = new TextGeometry(textGiven, {
                    font,
                    size: 0.3,
                    height: 0.01,
                });
                newLine = new THREE.Mesh(textGeometry);

                this.terminalContentGroup.traverse(function (object) {
                    object.position.y += 0.4;
                });

                this.terminalContentGroup.add(newLine);
            });
    }

    createDefaultTerminalLine() {
        this.inputFieldContent = this.defaultTerminalLine;
        this.updateInputField();
    }

    updateInputField() {
        this.inputFieldGroup.remove(this.inputFieldTextObject);
        this.fontLoader.load(
            './static/fonts/helvetiker_regular.typeface.json',
            (font) => {
                const textGeometry = new TextGeometry(this.inputFieldContent, {
                    font,
                    size: 0.3,
                    height: 0.01,
                });
                this.inputFieldTextObject = new THREE.Mesh(textGeometry);
                this.inputFieldGroup.add(this.inputFieldTextObject);
            });
    }

    update() {

    }
}