const { chromium } = require('playwright-core');
const fs = require('fs');

async function createReceipt() {
  const html = `
    <html>
      <body style="font-family: monospace; padding: 40px; background: white; width: 600px;">
        <h2>RootShala Solutions Pvt. Ltd.</h2>
        <p>Receipt Number: RS2508141025</p>
        <p>Date: 14 Aug 2026</p>
        <p>Customer: Greenfield Public School</p>
        <hr/>
        <table style="width: 100%; text-align: left;">
          <tr><th>Items</th><th>Amount</th></tr>
          <tr><td>RootShala School Management Software</td><td>49,999</td></tr>
          <tr><td>Student Module (Add-on)</td><td>9,999</td></tr>
          <tr><td>Mobile App Access</td><td>4,999</td></tr>
          <tr><td>Implementation & Training</td><td>7,499</td></tr>
          <tr><td>Cloud Backup (1 Year)</td><td>2,499</td></tr>
        </table>
        <hr/>
        <p>Subtotal: 75,995</p>
        <p>CGST: 6,839.55</p>
        <p>SGST: 6,839.55</p>
        <h3>Total: 89,674.10</h3>
        <p>Payment Method: UPI</p>
      </body>
    </html>
  `;
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  await page.screenshot({ path: 'receipt.png', fullPage: true });
  await browser.close();
}

createReceipt().catch(console.error);
