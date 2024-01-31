import TerminalBackEnd from './TerminalBackEnd.js';

const backend = new TerminalBackEnd();
const portfolioContent = await backend.recursivelySearchDirectories('MainDrive/Portfolio');
const projectParent = document.getElementById('portfolio');

const projects = portfolioContent.directories;
for (let i = 0; i < projects.length; i++) {
    let slashIndex = projects[i].lastIndexOf('/');
    let filteredName = projects[i].substring(slashIndex + 1);
    let itemContainer = document.createElement('div');
    itemContainer.className = 'portfolio-item';
    let itemName = document.createElement('h1');
    itemName.textContent = filteredName;
    itemContainer.appendChild(itemName);
    projectParent.appendChild(itemContainer);
}

const aboutmeFile = await backend.readFile('MainDrive/AboutMe/description.txt');
const aboutmeText = document.getElementById('aboutme-description');
aboutmeText.innerHTML = aboutmeFile.FileContent;
const rootPath = "https://nilsmeijer.com/Terminal/MainDrive/AboutMe/Photo.png";
const photoOfMe = document.getElementById('photo');
photoOfMe.src = rootPath;

const contactmeFile = await backend.readFile('MainDrive/ContactMe/description.txt');
const contactmeText = document.getElementById('contactme-description');
contactmeText.innerHTML = contactmeFile.FileContent;