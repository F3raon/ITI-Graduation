const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    defaultViewport: { width: 1440, height: 900 }
  });
  const page = await browser.newPage();
  
  console.log('Navigating to site...');
  await page.goto('https://ahmed-hamda-iti-grad.vercel.app/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  
  // Wait a bit for 3D elements to fully settle
  await new Promise(r => setTimeout(r, 6000));
  
  const sections = [
    { name: '1_INTRO', pct: 0 },
    { name: '2_OFFICE', pct: 0.16 },
    { name: '3_AHMED', pct: 0.30 }, // Ahmed reveal
    { name: '4_ABOUT', pct: 0.62 },
    { name: '5_SKILLS', pct: 0.68 },
    { name: '6_PROJECTS', pct: 0.77 },
    { name: '7_EXPERIENCE', pct: 0.81 },
    { name: '8_ACHIEVEMENTS', pct: 0.86 },
    { name: '9_CONTACT', pct: 0.91 },
    { name: '10_FINAL_PORTAL', pct: 1.0 }
  ];
  
  for (const sec of sections) {
    console.log(`Capturing ${sec.name} at ${sec.pct}...`);
    
    // Using the exposed scrollStore to set target
    await page.evaluate((targetPct) => {
      if (window.__scrollStore) {
        window.__scrollStore.target = targetPct;
        // Not snapping current so the camera smoothly interpolates (gives time for materials/animations)
      } else {
        console.error('No scrollStore found');
      }
    }, sec.pct);

    // Wait for the camera to lerp and settle (lerp factor is ~6 * delta, takes ~1.5s to settle)
    await new Promise(r => setTimeout(r, 2000));
    
    await page.screenshot({ path: `${sec.name}.png` });
  }
  
  await browser.close();
  console.log('Done!');
})();
