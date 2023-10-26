import puppeteer, {Browser, Page} from "puppeteer";

export class PokeScrapper {

    constructor(private readonly browser: Browser,public readonly page: Page) {
    }

    static async startUp(){
        const browser =  await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('https://pokedex-5e.herokuapp.com/')
        return new PokeScrapper(browser, page)
    }

    async close(){
        await this.browser.close()
    }

}