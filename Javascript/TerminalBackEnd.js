export default class TerminalBackEnd {
    directories;
    files;
    properties;

    constructor(properties) {
        this.properties = properties;
    }

    async recursivelySearchDirectories(directoryToSearch) {
        try {
            console.log(directoryToSearch);
            const formattedPath = directoryToSearch.replace(/\\/g, "/");
            console.log(formattedPath);
            const response = await fetch(`https://nilsmeijer.com/Terminal/ListAllDirectories.php?path=${encodeURIComponent(formattedPath)}`);
            const data = await response.json();
            console.log(data);

            this.directories = Object.values(data.directories);
            this.files = Object.values(data.files);
            return new Object({ directories: this.directories, files: this.files });
        } catch (error) {
            throw error;
        }
    }

    async checkDirectory(directory) {
        try {
            const formattedPath = directory.replace(/\\/g, "/");
            const url = `https://nilsmeijer.com/Terminal/CheckDirectory.php?data=${encodeURIComponent(formattedPath)}`;
            const response = await fetch(url);
            const isValid = await response.text();
            if (isValid.includes("true")) {
                return true;
            }
            else {
                console.log("Received:", isValid);
                return false;
            }
        } catch (error) {
            throw error;
        }
    }

    moveDownDirectory(currentDirectory, newDirectory) {
        //CurrentDirectory would look like "C:\Portfolio>".
        //Concatenation would look like "C:\Portfolio\AI_Theatre>".
        //Concatenate currentDirectory with newDirectory with correct formatting.
        this.properties.currentDirectory += ("\\" + newDirectory);
    }

    moveUpDirectory(currentDirectory) {
        //Removes last directory.
        //Filter for the last "\". Remove it and all characters behind it.
        //Add >

    }
}