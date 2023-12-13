export default class TerminalBackEnd {
    directories;
    files;

    constructor() {

    }

    async recursivelySearchDirectories() {
        try {
            const response = await fetch(`https://nilsmeijer.com/Terminal/ListAllDirectories.php?path=${encodeURIComponent(`./C:`)}`);
            const data = await response.json();

            if (import.meta.env.MODE === 'development') {
                // console.log('Directories:', data.directories);
                // console.log('files:', data.files);
            }

            this.directories = Object.values(data.directories);
            this.files = Object.values(data.files);
            return new Object({ directories: this.directories, files: this.files });
        } catch (error) {
            if (import.meta.env.MODE === 'development') {
                console.log("Error fetching directories:", error);
            }
            throw error;
        }
    }

    async checkDirectory(directory) {
        console.log("given directory:", directory)
        try {
            const url = `https://nilsmeijer.com/Terminal/CheckDirectory.php?data=${encodeURIComponent(directory)}`;
            const response = await fetch(url);
            const isValid = await response.text();

            if (isValid == "true")
                return true;
            else return false;
        } catch (error) {
            throw error;
        }
    }

    moveIntoDirectory() {
        
    }
}