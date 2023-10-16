import fs from 'fs';
import {puppeteerScraper} from "./puppeteerScraper";

const paths = ['site.png', 'bulba.png']

describe('puppeteer', () => {
    const basePath = 'src/screenshots/'


    afterAll(() => {
       paths.forEach((path) => {
           if (fs.existsSync(basePath+path)) {
               fs.unlinkSync(basePath+path);
           }
       })

    })
    it('should take a screenshot', async () => {
        const browser = await puppeteerScraper()
        const page = await browser.newPage();

        const filePath = basePath + 'site.png'

        await page.goto('https://pokedex-5e.herokuapp.com/');
        await page.screenshot({ path: filePath, optimizeForSpeed: true });
        await browser.close();


        expect(fs.existsSync(filePath)).toBeTruthy()
    }, 20000)

    it('should type into search bar then click on the first result', async () => {
        const browser = await puppeteerScraper()
        const page = await browser.newPage();

        const bulbaPath = basePath + "bulba.png"

        await page.goto('https://pokedex-5e.herokuapp.com/');
        await page.type('input[type="text"]', 'bulba');
        await page.click('div > .space-y-4')
        await page.screenshot({ path: bulbaPath, optimizeForSpeed: true });
        await browser.close();

        expect(fs.existsSync(bulbaPath)).toBeTruthy()
    }, 20000)

    it('should grab the text from the title of the monster entry', async () => {
        const browser = await puppeteerScraper()
        const page = await browser.newPage();

        await page.goto('https://pokedex-5e.herokuapp.com/');
        await page.type('input[type="text"]', 'bulba');
        await page.click('div > .space-y-4')

        const element = await page.$('div > .text-3xl.font-extrabold')
        const text = await page.evaluate(el => el.textContent, element)
        await browser.close();


        expect(text).toBe('Bulbasaur #1')
    }, 20000)

    //TODO:
    it('should grab the all of the text from the body of the monster entry', async () => {
        const browser = await puppeteerScraper()
        const page = await browser.newPage();

        await page.goto('https://pokedex-5e.herokuapp.com/');
        await page.type('input[type="text"]', 'bulba');
        await page.click('div > .space-y-4')

        const elements = await page.$$("div > .font-bold" )

        let textArray = []

        elements.forEach(async (element) => {
            textArray.push(await page.evaluate(el => el.textContent, element))
        })

        await browser.close();

        expect(textArray.length).toBeGreaterThan(0)


    }, 20000)
})