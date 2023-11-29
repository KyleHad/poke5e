import fs from 'fs';
import {PokeScrapper} from "./puppeteerScraper";

const paths = ['site.png', 'bulba.png']

describe('puppeteer', () => {
    const basePath = 'src/screenshots/'
    let pokeScrapper: PokeScrapper


    beforeAll(() => {
        if(!fs.existsSync('src/screenshots')){
            fs.mkdirSync('src/screenshots')
        }
    })

    beforeEach(async () => {
        pokeScrapper = await PokeScrapper.startUp()
    })

    afterAll(() => {
       paths.forEach((path) => {
           if (fs.existsSync(basePath+path)) {
               fs.unlinkSync(basePath+path);
           }
       })

    })

    it('should type into search bar then click on the first result', async () => {

        const bulbaPath = basePath + "bulba.png"

        await pokeScrapper.page.type('input[type="text"]', 'bulba');
        await pokeScrapper.page.click('div > .space-y-4')
        await pokeScrapper.page.screenshot({ path: bulbaPath, optimizeForSpeed: true });

        await pokeScrapper.close()

        expect(fs.existsSync(bulbaPath)).toBeTruthy()
    }, 20000)

    it('should grab the text from the title of the monster entry', async () => {
        await pokeScrapper.page.type('input[type="text"]', 'bulba');
        await pokeScrapper.page.click('div > .space-y-4')

        const element = await pokeScrapper.page.$('div > .text-3xl.font-extrabold')
        const text = await pokeScrapper.page.evaluate(el => el.textContent, element)

        await pokeScrapper.close()

        expect(text).toBe('Bulbasaur #1')
    }, 20000)

    //TODO:
    it('should grab the all of the text from the body of the monster entry', async () => {

        await pokeScrapper.page.type('input[type="text"]', 'bulba');
        await pokeScrapper.page.click('div > .space-y-4')

        const elements = await pokeScrapper.page.$$("div > .font-bold" )

        let textArray = []

        const elementTextPromise = elements.map(async (element) =>
            await pokeScrapper.page.evaluate(el => el.textContent, element)
        )

        textArray = await Promise.all(elementTextPromise)

        await pokeScrapper.close()

        expect(textArray.length).toBeGreaterThan(0)


    }, 20000)

    it('should grab all html on the screen', async () => {
        const data = await pokeScrapper.page.content()

        expect(data).toContain('<body>')
        expect(data).toContain('</body>')
    })
})