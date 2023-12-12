export default class TerminalProperties {
    asciiArt = `                                                                                                                                                                       
 _   _ _ _      ___  ___     _ _           
| \ | (_) |     |  \/  |    (_|_)          
|  \| |_| |___  | .  . | ___ _ _  ___ _ __ 
| .   | | / __| | |\/| |/ _ \ | |/ _ \ '__|
| |\  | | \__ \ | |  | |  __/ | |  __/ |   
\_| \_/_|_|___/ \_|  |_/\___|_| |\___|_|   
                             _/ |          
                            |__/           `;

    customDefaultText = ["Portfolio of Nils Meijer [Version 10.12.2023]",
        "(c) Meijer Inc. All rights reserved. Work in progress."]

    specialKeys = ["Shift", "CapsLock", "Enter", "Control", "ContextMenu", "Tab", "Alt",
        "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
        "Insert", "Home", "PageUp", "PageDown", "Delete", "End",
        "Numlock", "ScrollLock", "Pause", "Escape", "Meta", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]
    defaultTerminalLine = "C:\\>";
    addedToTerminalPath = "";
    validCommandsMap = new Map([
        ["help", "Lists all commands available."],
        ["dir", "Lists all subdirectories of this directory."],
        ["cd", "Move into specified directory."],
        ["type", "Show content of specified file."],
        ["clear", "Clear the terminal screen"]
    ]);
    errorMessageInvalidCommand = " is not recognized as an internal or external command.";
    errorMessageInvalidDirectory = "The system cannot find the path specified.";
}