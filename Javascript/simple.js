import TerminalBackEnd from './TerminalBackEnd.js';

const backend = new TerminalBackEnd();
const portfolioContent = await backend.recursivelySearchDirectories('MainDrive/Portfolio');
const projectParent = document.getElementById('portfolio');

const projects = portfolioContent.directories;
for (let i = 0; i < projects.length; i++) {
    let clickable = document.createElement('a');
    let itemContainer = document.createElement('div');
    let clickHint = document.createElement('h2');
    let itemName = document.createElement('h1');
    let itemDescription = document.createElement('p');
    let itemImage = document.createElement('img');

    itemContainer.appendChild(itemName);
    itemContainer.appendChild(clickHint);
    itemContainer.appendChild(itemDescription);
    itemContainer.appendChild(itemImage);
    projectParent.appendChild(clickable);

    let slashIndex = projects[i].lastIndexOf('/');
    let filteredName = projects[i].substring(slashIndex + 1);
    clickable.className = 'portfolio-clickable';
    clickable.href = "https://github.com/ngmeijer/" + filteredName + "/wiki";
    clickable.target = "_blank";

    itemContainer.className = 'portfolio-item';
    itemContainer.id = filteredName;
    clickable.appendChild(itemContainer);

    itemImage.src = "https://nilsmeijer.com/Terminal/MainDrive/Portfolio/" + filteredName +"/ItemImage.png";
    console.log(itemImage.src);
    itemImage.className = "item-image";

    clickHint.textContent = "Click to show more content!";
    clickHint.className = "click-hint";

    const itemData = await backend.readFile(`${projects[i]}/description.txt`);
    itemDescription.innerHTML = itemData.FileContent
    itemDescription.className = 'item-summary';

    itemName.textContent = filteredName;
    itemName.className = 'item-name';
}

const aboutmeFile = await backend.readFile('MainDrive/AboutMe/description.txt');
const aboutmeText = document.getElementById('aboutme-description');
aboutmeText.innerHTML = aboutmeFile.FileContent;
const rootPath = "https://nilsmeijer.com/Terminal/MainDrive/AboutMe/Photo.png";
const photoOfMe = document.getElementById('photo');
photoOfMe.src = rootPath;

const contactmeFile = await backend.readFile('MainDrive/ContactMe/description.txt');
const contactmeText = document.getElementById('contactme-channel-container');
contactmeText.innerHTML = contactmeFile.FileContent;