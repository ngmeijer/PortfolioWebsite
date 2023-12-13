export default class TerminalProperties {
    asciiArt = `                                                                                                                                                                       
    ________   ___  ___       ________                              
    |\   ___  \|\  \|\  \     |\   ____\                             
    \ \  \\ \  \ \  \ \  \    \ \  \___|_                            
     \ \  \\ \  \ \  \ \  \    \ \_____  \                           
      \ \  \\ \  \ \  \ \  \____\|____|\  \                          
       \ \__\\ \__\ \__\ \_______\____\_\  \                         
        \|__| \|__|\|__|\|_______|\_________\                        
                                 \|_________|                        
                                                                     
                                                                     
     _____ ______   _______   ___        ___  _______   ________     
    |\   _ \  _   \|\  ___ \ |\  \      |\  \|\  ___ \ |\   __  \    
    \ \  \\\__\ \  \ \   __/|\ \  \     \ \  \ \   __/|\ \  \|\  \   
     \ \  \\|__| \  \ \  \_|/_\ \  \  __ \ \  \ \  \_|/_\ \   _  _\  
      \ \  \    \ \  \ \  \_|\ \ \  \|\  \\_\  \ \  \_|\ \ \  \\  \| 
       \ \__\    \ \__\ \_______\ \__\ \________\ \_______\ \__\\ _\ 
        \|__|     \|__|\|_______|\|__|\|________|\|_______|\|__|\|__|`;

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
        ["cd", "Move into specified directory.\nExample: 'cd Portfolio' will move current directory to Portfolio.\n'./' will move current directory one level up."],
        ["type", "Show content of specified file.\nExample: 'type AI_Theatre' will display the contents of that file."],
        ["clear", "Clear the terminal screen"]
    ]);
    errorMessageInvalidCommand = " is not recognized as an internal or external command.";
    errorMessageInvalidDirectory = "The system cannot find the path specified.";
    helpMessage = "Use 'help' to show valid commands.";
}