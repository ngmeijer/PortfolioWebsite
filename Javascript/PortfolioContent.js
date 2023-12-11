import TemplatePage from './TemplatePage.js';

export default class PortfolioContent extends TemplatePage {

    //This should be updated so that I don't have to add array elements every time I want to add a portfolio item.
    //Rather, it should recursively follow the folder structure on the server.
    possibleItems = ["AI_Theatre", "Minor_Skilled"]
}
