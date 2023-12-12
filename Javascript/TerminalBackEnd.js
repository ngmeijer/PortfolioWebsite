export default class TerminalBackEnd{
    constructor(){

    }

    async recursivelySearchDirectories() {
        try {
            const response = await fetch(`https://nilsmeijer.com/Terminal/ListAllDirectories.php?path=${encodeURIComponent(`Terminal`)}`);
            const data = await response.json();

            if (import.meta.env.MODE === 'development') {
                // console.log('Directories:', data.directories);
                // console.log('files:', data.files);
            }

            const dirArray = Object.values(data.directories);
            const fileArray = Object.values(data.files);
            return new Object({ directories: dirArray, files: fileArray });
        } catch (error) {
            if (import.meta.env.MODE === 'development') {
                console.log("Error fetching directories:", error);
            }
            throw error;
        }
    }

    getDirectory() {
        
    }
}