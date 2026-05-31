import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message, err.stack));
    
    // Set mock local storage for auth to bypass login
    await page.goto('http://localhost:5173');
    await page.evaluate(() => {
      localStorage.setItem('nexus_user', JSON.stringify({
        token: 'fake-token',
        user: { id: '123', name: 'Test User', email: 'test@test.com', status: 'approved', role: 'user' }
      }));
    });
    
    await page.goto('http://localhost:5173/dashboard');
    
    // Wait a bit to let it render and crash
    await new Promise(r => setTimeout(r, 3000));
    
    await browser.close();
  } catch(e) {
    console.error('SCRIPT ERROR:', e);
  }
})();
