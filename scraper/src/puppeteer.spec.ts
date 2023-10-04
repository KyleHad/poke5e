import puppeteer from "puppeteer";
import fs from 'fs';
describe('puppeteer', () => {
    const filePath ='src/screenshots/github.png'

    afterEach(() => {
        if (fs.existsSync(filePath)) {
            // Delete the file using fs.unlinkSync()
            fs.unlinkSync(filePath);
        }
    })
    it('should take a screenshot', async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto('https://github.com');
        await page.screenshot({ path: filePath, optimizeForSpeed: true });
        await browser.close();


        expect(fs.existsSync(filePath)).toBeTruthy()
    }, 20000)
})