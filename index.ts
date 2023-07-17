import {chromium} from '@playwright/test';
import fs from 'fs';

async function main(): Promise<void> {
 
  const browser = await chromium.launch({
    headless: false, // setting this to true will not run the UI
  });

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://www.coingecko.com');

  // cripto prices selectors
  const selectorBtcPrice = 'body > div:nth-child(6) > main > div.gecko-table-container > div.coingecko-table > div.position-relative > div > table > tbody > tr:nth-child(1) > td.td-price.price.text-right > div > div.tw-flex-1 > span';
  const selectorEthPrice = 'body > div:nth-child(6) > main > div.gecko-table-container > div.coingecko-table > div.position-relative > div > table > tbody > tr:nth-child(2) > td.td-price.price.text-right > div > div.tw-flex-1 > span';
  const selectorLtcPrice = 'body > div:nth-child(6) > main > div.gecko-table-container > div.coingecko-table > div.position-relative > div > table > tbody > tr:nth-child(13) > td.td-price.price.text-right > div > div.tw-flex-1 > span';
  const selectorDotPrice = 'body > div:nth-child(6) > main > div.gecko-table-container > div.coingecko-table > div.position-relative > div > table > tbody > tr:nth-child(14) > td.td-price.price.text-right > div > div.tw-flex-1 > span';
 
  
  const uncheckedSelectors: string[] = [];
  uncheckedSelectors.push(selectorBtcPrice);
  uncheckedSelectors.push(selectorEthPrice);
  uncheckedSelectors.push(selectorLtcPrice);
  uncheckedSelectors.push(selectorDotPrice);

const crypto:string[] = ['BTC', 'ETH', 'LTC', 'DOT'];

const values: (string | null)[] = [];

 for(const selector of uncheckedSelectors) {
  const elementHandle = await page.$(selector);

  const value = elementHandle ? await page.evaluate((element) => element.textContent, elementHandle) : null;
  values.push(value);
 

 }

 const dataToExport: (string | null)[][] = [crypto, values];
  
 console.log('Extracted values:', dataToExport);



 const csvData: string = dataToExport.map((row) => row.join(',')).join('\n');
 
 fs.writeFile('extracted_values', csvData, 'utf-8', (err) => {
  if(err) {
    console.log('Error writing to file:', err);
  }else{
    console.log('Data saved to extracted_values.csv');
  }
 });
  
  
 await page.waitForTimeout(5000);  // You can add additional code here to interact with the page
await browser.close();
}

main();
