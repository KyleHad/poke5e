import puppeteer, {Browser, Page} from "puppeteer";

export class PokeScrapper {

    constructor(private readonly browser: Browser,public readonly page: Page) {
    }

    static async startUp(){
        const browser =  await puppeteer.launch({headless: 'new'})
        const page = await browser.newPage()
        await page.goto('https://pokedex-5e.herokuapp.com/', { waitUntil: 'networkidle0' })
        return new PokeScrapper(browser, page)
    }

    async selectMon(
        name: string
    ) {
        await this.page.type('input[type="text"]', name);
        await this.page.click('div > .space-y-4')
    }

    async close(){
        await this.browser.close()
    }

}