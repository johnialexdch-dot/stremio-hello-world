//////////////// Launch Puppeteer

console.log('start start_puppeteer.js')

const { exec } = require('child_process');

console.log("Environment Variables:")
console.log(process.env)


const command = 'lsb_release -a';

function run_crm(command) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Error:', error);
            return;
        }

        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
    });
}
try{
    run_crm('lsb_release -a')
    run_crm('cat /etc/issue')
    run_crm('cat /etc/issue.net ')
    run_crm('cat /etc/lsb-release ')
    run_crm('cat /etc/os-release ')
    run_crm('cat /etc/centos-release')
    run_crm('cat /etc/lsb-release')
    run_crm('cat /etc/redhat-release ')
    run_crm('cat /etc/system-release')
    run_crm('cat /etc/os-release ')
} catch {
    console.log("error run_crm")
}






const puppeteer = require('puppeteer');

async function launch_puppeteer() {
    console.log('start lauch_puppeteer')

    // Launch a headless Chrome browser
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

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