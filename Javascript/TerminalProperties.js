export default class TerminalProperties {
    defaultFont;
    asciiFont;
    
    asciiArt = `
 _   _ _ _      ___  ___     _ _           
| \\ | (_) |     |  \\/  |    (_|_)          
|  \\| |_| |___  | .  . | ___ _ _  ___ _ __ 
| . \` | | / __| | |\\/| |/ _ \\ | |/ _ \\ '__|
| |\\  | | \\__ \\ | |  | |  __/ | |  __/ |   
\\_| \\_/\\_|___/ \\_|  |_|\\___|_|_|\\___|_|   
                             _/ |          
                            |__/           `;


    customDefaultText = ["Portfolio of Nils Meijer [Version 01.01.2024]",
        "(c) Meijer Inc. All rights reserved. Work in progress.",
    "Waiting for system assets to initialize...",
    "System ready."]

    specialKeys = ["Shift", "CapsLock", "Enter", "Control", "ContextMenu", "Tab", "Alt",
        "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
        "Insert", "Home", "PageUp", "PageDown", "Delete", "End",
        "Numlock", "ScrollLock", "Pause", "Escape", "Meta", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]
    validCommandsMap = new Map([
        ["help", "Lists all commands available."],
        ["dir", "Lists all subdirectories of this directory."],
        ["cd", "Move into specified directory.\nExample: 'cd Portfolio' will move current directory to Portfolio.\n'../' will move current directory one level up."],
        ["show", "Show content of specified file.\nExample: 'show aboutme.txt' will display the contents of that file."],
        ["clear", "Clear the terminal screen"]
    ]);
    messageOnCommandDir = "Finding directories..."
    messageOnCommandType = ["Opening file", "and reading contents..." ]
    errorMessageInvalidCommand = " is not recognized as an internal or external command.";
    errorMessageInvalidDirectory = "The system cannot find the path specified.";
    errorMessageInvalidFile = "Error reading file."
    helpMessage = "Use 'help' to show valid commands.";

    //
    rootDirectory = "MainDrive";
    currentDirectory;
    formattedDir = "";
}