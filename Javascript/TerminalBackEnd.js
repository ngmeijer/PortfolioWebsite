export default class TerminalBackEnd {
    directories;
    files;
    fileURLs;
    properties;

    constructor(properties) {
        this.properties = properties;
    }

    async recursivelySearchDirectories(directory) {
        try {
            const formattedPath = directory.replace(/\\/g, "/");
            const response = await fetch(`https://nilsmeijer.com/Terminal/ListAllDirectories.php?path=${encodeURIComponent(formattedPath)}`);
            const data = await response.json();

            this.directories = Object.values(data.directories);
            this.files = Object.values(data.files);
            // this.fileURLs = Object.values(data.fileURLs);
            return new Object({ directories: this.directories, files: this.files });
        } catch (error) {
            throw error;
        }
    }

    async checkDirectory(directory) {
        try {
            const formattedPath = directory.replace(/\\/g, "/");
            const url = `https://nilsmeijer.com/Terminal/CheckDirectory.php?data=${encodeURIComponent(formattedPath)}`;
            console.log(formattedPath);
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

    async readFile(directory) {
        try {
            const formattedPath = directory.replace(/\\/g, "/");
            const url = `https://nilsmeijer.com/Terminal/GetFile.php?data=${encodeURIComponent(formattedPath)}`;
            const response = await fetch(url);
            const fileContent = await response.json();
            return fileContent;
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