export default class TerminalBackEnd {
    directories;
    files;


    constructor() {

    }

    async recursivelySearchDirectories(directoryToSearch) {
        try {
            const response = await fetch(`https://nilsmeijer.com/Terminal/ListAllDirectories.php?path=${encodeURIComponent(directoryToSearch)}`);
            const data = await response.json();

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
            console.log(response);
            if (isValid == "true")
                return true;
            else return false;
        } catch (error) {
            throw error;
        }
    }

    moveDownDirectory(currentDirectory, newDirectory) {
        //CurrentDirectory would look like "C:\Portfolio>".
        //Concatenation would look like "C:\Portfolio\AI_Theatre>".
        //Concatenate currentDirectory with newDirectory with correct formatting.


    }

    moveUpDirectory(currentDirectory) {
        //Removes last directory.
        //Filter for the last "\". Remove it and all characters behind it.
        //Add >
        

    }
}