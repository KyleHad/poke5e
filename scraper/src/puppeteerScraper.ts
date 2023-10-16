import puppeteer from "puppeteer";

export async function puppeteerScraper() {
    return await puppeteer.launch()
}