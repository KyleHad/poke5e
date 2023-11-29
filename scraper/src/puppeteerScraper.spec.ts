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

        await pokeScrapper.selectMon('bulba')
        await pokeScrapper.page.screenshot({ path: bulbaPath, optimizeForSpeed: true });

        await pokeScrapper.close()

        expect(fs.existsSync(bulbaPath)).toBeTruthy()
    }, 20000)

    it('should grab the text from the title of the monster entry', async () => {
        await pokeScrapper.selectMon('bulba')

        const element = await pokeScrapper.page.$('div > .text-3xl.font-extrabold')
        const text = await pokeScrapper.page.evaluate(el => el.textContent, element)

        await pokeScrapper.close()

        expect(text).toBe('Bulbasaur #1')
    }, 20000)

    //TODO:
    it('should grab the all of the text from the body of the monster entry', async () => {

        await pokeScrapper.selectMon('bulba')

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

    it('should grab all html on the screen after opening all tabs', async () => {
        await pokeScrapper.selectMon('bulba')

        const data = await pokeScrapper.page.content()

        expect(data).toContain('This Pokémon doubles its STAB bonus when it has 25% or less of its maximum health')

        expect(data).toContain('You rush forward and slam into a creature. Make a melee attack roll against a target, doing normal damage on a hit.')

        expect(data).toContain('You send a downpour of potent, poisonous rain in a 5 foot radius, centered on a point within range. Targets in the area must make a CON save against your MOVE DC or become poisoned. Creatures poisoned by this move take double the normal poison damage.')
    })
})