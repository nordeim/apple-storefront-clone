// Browser smoke test. Needs: npm run build, plus 'npm i --no-save playwright' and 'npx playwright install chromium'.
// Run from the repo root: node tests/e2e/smoke.mjs  (exits non-zero on any FAIL).
import { chromium } from 'playwright';
const url = `file://${process.cwd()}/dist/index.html`;
const b = await chromium.launch();
/** @type {string[]} */
const results = [];
/** @type {string[]} */
const errors = [];
/** @param {string} name @param {boolean} cond @param {string} [extra] */
const ok = (name, cond, extra='') => { results.push(`${cond ? 'PASS' : 'FAIL'} ${name} ${extra}`); };
/** @param {import('playwright').Page} p @param {() => Promise<boolean>} fn @param {number} [timeout] */
const waitForState = async (p, fn, timeout = 12000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await fn()) return true;
    await p.waitForTimeout(400);
  }
  return false;
};
/** @param {import('playwright').ViewportSize} [vp] @param {Record<string, unknown>} [opts] */
async function page(vp, opts={}) {
  const ctx = await b.newContext({ viewport: vp, ...opts });
  const p = await ctx.newPage();
  p.on('console', m => { if (['error','warning'].includes(m.type())) errors.push(m.text()); });
  p.on('pageerror', e => errors.push('pageerror ' + e.message));
  return p;
}
// ---------- desktop
let p = await page({width:1440,height:900});
await p.goto(url); await p.waitForTimeout(500);
ok('title home', (await p.title()) === 'Apple (Singapore)', await p.title());
ok('hamburger hidden on desktop', !(await p.locator('button[aria-label="Menu"]').isVisible()));
ok('3 hero + 6 promo tiles', (await p.locator('.section-hero .tile').count())===3 && (await p.locator('.section-promo .tile').count())===6);
// flyout
await p.locator('a.globalnav-link', {hasText:'iPhone'}).hover();
ok('flyout opens on hover', await p.locator('#flyout-iphone').isVisible());
ok('flyout lists iPhone 18 Pro', await p.locator('#flyout-iphone a', {hasText:'iPhone 18 Pro'}).isVisible());
await p.mouse.move(700,850); await p.waitForTimeout(100);
ok('flyout closes on leave', (await p.locator('#flyout-iphone').count())===0);
// search
await p.getByRole('button',{name:'Search apple.com'}).click();
await p.locator('#site-search').fill('macbook');
ok('search live results', (await p.locator('#search-panel a', {hasText:'MacBook Pro'}).count())>=2);
await p.locator('#site-search').press('Enter'); await p.waitForTimeout(200);
ok('search route', p.url().includes('#/search?q=macbook'));
ok('search page cards', (await p.locator('main ul > li').count())>=2);
await p.keyboard.press('Escape');
// product -> bag
await p.goto(url+'#/product/iphone-18-pro?buy'); await p.reload(); await p.waitForTimeout(300);
await p.locator('label', {hasText:'512GB'}).click();
ok('price updates to 2,099', await p.getByText('S$2,099').first().isVisible());
await p.getByRole('button',{name:'Add to Bag'}).click();
ok('added status', await p.getByRole('status').filter({hasText:'Added iPhone 18 Pro'}).isVisible());
ok('bag badge 1', (await p.locator('.globalnav-badge').textContent())==='1');
await p.getByRole('button',{name:/Shopping Bag/}).click();
ok('bag popover shows item', await p.locator('#bag-popover', {hasText:'iPhone 18 Pro'}).isVisible());
await p.getByRole('link',{name:'Review Bag'}).first().click(); await p.waitForTimeout(200);
ok('bag page', p.url().endsWith('#/bag'));
await p.locator('select[id^="qty-"]').selectOption('2');
ok('subtotal 4,198', await p.getByText('S$4,198').first().isVisible());
ok('GST line', await p.getByText('Includes GST (9%)').isVisible());
await p.getByRole('link',{name:'Check Out'}).click(); await p.waitForTimeout(200);
await p.getByRole('button',{name:'Place Order'}).click();
ok('validation errors shown', (await p.locator('[role=alert]').count())===5);
ok('focus moves to first invalid', await p.evaluate(()=>document.activeElement?.getAttribute('name'))==='fullName');
await p.fill('[name=fullName]','Tan Wei Ming'); await p.fill('[name=email]','w@example.com');
await p.fill('[name=phone]','91234567'); await p.fill('[name=address]','1 Raffles Place'); await p.fill('[name=postalCode]','12345');
await p.getByRole('button',{name:'Place Order'}).click();
ok('bad postal code rejected', await p.getByText('Postal codes in Singapore have 6 digits.').isVisible());
await p.fill('[name=postalCode]','048616');
await p.getByRole('button',{name:'Place Order'}).click(); await p.waitForTimeout(300);
ok('confirmation route', /#\/confirmation\/EL-[A-Z0-9]{8}$/.test(p.url()), p.url().split('#')[1] ?? '');
ok('order number shown', /^EL-/.test((await p.getByTestId('order-number').textContent()) ?? ''));
ok('bag emptied', (await p.locator('.globalnav-badge').count())===0);
// support lookup
const orderNo = (await p.getByTestId('order-number').textContent()) ?? '';
await p.goto(url+'#/support'); await p.fill('#order-lookup', orderNo); await p.getByRole('button',{name:'Check'}).click();
ok('order status lookup', await p.getByText(`Order ${orderNo} is confirmed`).isVisible());
// 404 / hostile routes
await p.goto(url+'#/product/<img src=x onerror=alert(1)>'); await p.reload();
ok('hostile product route -> 404', await p.getByText('We couldn’t find that page.').isVisible());
await p.goto(url+'#/search?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E'); await p.reload();
ok('XSS query rendered as text', (await p.locator('script', {hasText:'alert(1)'}).count())===0 && await p.getByText('<script>alert(1)</script>').first().isVisible());
await p.goto(url+'#/info/privacy'); await p.reload();
ok('info page title', (await p.title()).startsWith('Privacy'));
// gallery
await p.goto(url+'#/'); await p.reload();
await p.locator('.gallery').scrollIntoViewIfNeeded();
const firstDot = await p.locator('.dotnav-dot[aria-selected=true]').getAttribute('id');
ok('gallery autoplays', await waitForState(p, async () => (await p.locator('.dotnav-dot[aria-selected=true]').getAttribute('id')) !== firstDot));
await p.getByRole('button',{name:'Pause Apple TV+ gallery'}).click();
const s1 = await p.locator('.dotnav-dot[aria-selected=true]').getAttribute('id'); await p.waitForTimeout(4600);
ok('gallery pause holds', s1 === await p.locator('.dotnav-dot[aria-selected=true]').getAttribute('id'));
await p.locator('.dotnav-dot[aria-selected=true]').focus(); await p.keyboard.press('ArrowRight');
ok('gallery arrow key', (await p.locator('.dotnav-dot[aria-selected=true]').getAttribute('id')) !== s1);
// holiday play/pause
await p.evaluate(()=>window.scrollTo(0,0));
await p.getByRole('button',{name:'Pause Holiday 2026 animation'}).click();
ok('holiday paused', (await p.locator('[data-tile-id=holiday-2026]').getAttribute('data-playing'))==='false');
// duo reveal (state-based polling — the reveal is class-driven)
await p.locator('[data-tile-id=iphone-duo]').scrollIntoViewIfNeeded();
ok('duo subhead revealed', await waitForState(p, async () => (await p.locator('.duo-subhead.is-revealed').count()) === 1));
// computed styles vs reference tokens
const css = await p.evaluate(()=>{ const g=(/** @type {string} */ s,/** @type {string} */ pr)=>{ const el=document.querySelector(s); return el ? getComputedStyle(el)[/** @type {keyof CSSStyleDeclaration} */ (pr)] : ''; };
  return { h:g('.section-hero h2','fontSize'), hw:g('.section-hero h2','fontWeight'), sub:g('.section-hero .tile-subhead','fontSize'), btnR:g('.tile .button','borderTopLeftRadius'), btnBg:g('.tile .button','backgroundColor'), tileH:g('.section-hero .tile','minHeight'), promoH:g('.section-promo .tile','minHeight'), navH:g('.globalnav','height'), promoH3:g('.section-promo h3','fontSize'), ribbon:g('.ribbon','fontSize'), footerBg:g('.footer','backgroundColor')}; });
console.log(JSON.stringify(css));
ok('tokens', css.h==='56px'&&css.hw==='600'&&css.sub==='28px'&&css.btnR==='980px'&&css.btnBg==='rgb(0, 113, 227)'&&css.tileH==='692px'&&css.promoH==='580px'&&css.navH==='44px'&&css.promoH3==='40px'&&css.footerBg==='rgb(245, 245, 247)');
// ---------- mobile
p = await page({width:390,height:844}, {hasTouch:true});
await p.goto(url); await p.waitForTimeout(500);
ok("no horizontal overflow (mobile)", await p.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth), String(await p.evaluate(()=>document.documentElement.scrollWidth)));
ok('desktop links hidden on mobile', !(await p.locator('a.globalnav-link', {hasText:'Entertainment'}).isVisible()));
await p.getByRole('button',{name:'Menu'}).click();
ok('mobile menu opens', await p.locator('#mobile-menu').isVisible());
await p.locator('#mobile-menu a', {hasText:'Mac'}).click(); await p.waitForTimeout(300);
// session-13 D17: the nav-main Mac destination is the marketing page (#/mac,
// the reference's /sg/mac/); the store page stays one flyout deeper.
ok('mobile nav navigates + closes', p.url().endsWith('#/mac') && (await p.locator('#mobile-menu').count())===0);
ok('mobile tile headline 32px', await (async()=>{await p.goto(url);await p.reload();return (await p.evaluate(()=>{ const el=document.querySelector('.section-hero h2'); return el ? getComputedStyle(el).fontSize : ''; }))==='32px'})());
ok('mobile promo single column', (await p.evaluate(()=>{ const el=document.querySelector('.section-promo'); return el ? getComputedStyle(el).gridTemplateColumns.split(' ').length : 0; }))===1);
await p.locator('.footer').scrollIntoViewIfNeeded();
const acc = p.locator('.footer button[aria-expanded]').first();
await acc.click();
ok('footer accordion expands', (await acc.getAttribute('aria-expanded'))==='true');
for (const r of ['#/store','#/bag','#/checkout','#/entertainment','#/support','#/product/macbook-pro-m6']) {
  await p.goto(url+r); await p.reload(); await p.waitForTimeout(150);
  ok('mobile no overflow '+r, await p.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth));
}
console.log(results.join('\n'));
console.log('console errors/warnings:', errors.length ? errors.join(' | ') : 'none');
await b.close();
if (results.some((r) => r.startsWith('FAIL')) || errors.length) process.exit(1);
