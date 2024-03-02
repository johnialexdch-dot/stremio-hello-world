//////////////// Launch Puppeteer

console.log('start start_puppeteer.js')

const puppeteer = require('puppeteer');

async function launch_puppeteer() {
    console.log('start lauch_puppeteer')

  // Launch a headless Chrome browser
  const browser = await puppeteer.launch({headless: true,
                                        args: [
                                            '--no-sandbox',
                                            '--disable-setuid-sandbox'
                                        ]});

  // Create a new page
  const page = await browser.newPage();

  // Navigate to the desired URL
  await page.goto('https://www.example.com');

  // Wait for the page to load (optional)
  await page.waitForSelector('body'); // Waits for the body element to be loaded

  // Do something with the loaded page (e.g., interact with elements)
  // ...

  // Close the browser
  await browser.close();

  console.log('end lauch_puppeteer')
};

console.log('end start_puppeteer.js')

module.exports = launch_puppeteer