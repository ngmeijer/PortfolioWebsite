import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

export default class FontManager {
    terminal;
    portfolio;

    fontLoader;

    constructor(terminalProperties, portfolioProperties) {
        this.terminal = terminalProperties;
        this.portfolio = portfolioProperties;

        this.fontLoader = new FontLoader();
    }

    async loadFonts() {
        try {
            await new Promise((resolve, reject) => {
                this.fontLoader.load('../../static/fonts/hack.json', (font) => {
                    resolve(font);
                    this.terminal.defaultFont = font;
                    this.portfolio.defaultFont = font;
                }, undefined, reject);
            });

            await new Promise((resolve, reject) => {
                this.fontLoader.load('../../static/fonts/Courier.json', (font) => {
                    resolve(font);
                    this.terminal.asciiFont = font;
                }, undefined, reject);
            });
        } catch (error) {
            throw error;
        }
    }
}