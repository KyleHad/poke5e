import puppeteer from "puppeteer";

describe('puppeteer', () => {
    it('should take a screenshot', async () => {
        const test = 3;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto('https://github.com');
        await page.screenshot({ path: 'screenshots/github.png' });

        expect(test).toBe(3)
    })
})