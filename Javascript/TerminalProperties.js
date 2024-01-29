export default class TerminalProperties {
    defaultFont;
    asciiFont;
    
    asciiArt = `
    
    _   ___ __        __  ___     _   _          
   / | / (_) /____   /  |/  /__  (_) (_)__  _____
  /  |/ / / / ___/  / /|_/ / _ \/ / / / _ \/ ___/
 / /|  / / (__  )  / /  / /  __/ / / /  __/ /    
/_/ |_/_/_/____/  /_/  /_/\___/_/_/ /\___/_/     
                               /___/             
`;


    customDefaultText = ["Portfolio of Nils Meijer [Version 29.01.2024]",
        "(c) Meijer Inc. All rights reserved. Work in progress.",
    "Waiting for system assets to initialize...",
    "System ready."]

    specialKeys = ["Shift", "CapsLock", "Enter", "Control", "ContextMenu", "Tab", "Alt",
        "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
        "Insert", "Home", "PageUp", "PageDown", "Delete", "End",
        "Numlock", "ScrollLock", "Pause", "Escape", "Meta", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]
    validCommandsMap = new Map([
        ["<span class='syntax'>help</span>", "Lists all commands available."],
        ["<span class='syntax'>dir</span>", "Lists all subdirectories of this directory."],
        ["<span class='syntax'>cd</span>", "Move into specified directory.\n<span class='command-description'>Example: '<span class='syntax'>cd</span> Portfolio' will move current directory to Portfolio.\n\t'<span class='syntax'>cd ../</span>' will move current directory one level up.</span>"],
        ["<span class='syntax'>clear</span>", "Clear the terminal screen"]
    ]);
    messageOnCommandDir = "Finding directories..."
    messageOnCommandType = ["Opening directory", "and reading contents..." ]
    errorMessageInvalidCommand = " is not recognized as an internal or external command.";
    errorMessageInvalidDirectory = "The system cannot find the path specified.";
    errorMessageInvalidFile = "Error reading file."
    helpMessage = "Use '<span class='syntax'>help</span>' to show valid commands.";

    //
    rootDirectory = "MainDrive";
    currentDirectory;
    formattedDir = "";
}