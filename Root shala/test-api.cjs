const fs = require('fs');

async function testExtract() {
  const image = fs.readFileSync('receipt.png');
  const base64Image = `data:image/png;base64,${image.toString('base64')}`;

  const body = JSON.stringify({
    imageBase64: base64Image,
    mimeType: 'image/png',
    documentType: 'FEE_RECEIPT',
    fileName: 'receipt.png'
  });

  console.log("Sending request to http://localhost:5174/api/documents/extract, body length:", body.length);

  try {
    const res = await fetch('http://localhost:5174/api/documents/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });
    
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response text:", text);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

testExtract();
