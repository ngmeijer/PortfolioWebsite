export default class TerminalBackEnd {
    directories;
    files;
    properties;

    constructor(properties) {
        this.properties = properties;
    }

    async recursivelySearchDirectories(directoryToSearch) {
        try {
            const formattedPath = directoryToSearch.replace(/\\/g, "/");
            const response = await fetch(`https://nilsmeijer.com/Terminal/ListAllDirectories.php?path=${encodeURIComponent(formattedPath)}`);
            const data = await response.json();

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

    moveDownDirectory(newDirectory) {
        this.properties.currentDirectory += ("\\" + newDirectory);
    }

    moveUpDirectory() {
        let lastIndex = this.properties.currentDirectory.lastIndexOf("\\");
        let result = this.properties.currentDirectory.substring(0, lastIndex);
        this.properties.currentDirectory = result;
    }
}