import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const widths=[320,360,390,430];

for(const width of widths){
  test(`public + mobile shell at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:844});
    const pageErrors=[]; page.on('pageerror',e=>pageErrors.push(String(e)));

    await page.goto('/index.html');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('#curriculumUnits .unit')).toHaveCount(34);
    expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth)).toBeLessThanOrEqual(1);
    const a11y=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();
    expect(a11y.violations.filter(v=>['critical','serious'].includes(v.impact||''))).toEqual([]);
    await page.screenshot({path:`test-results/mobile-${width}-landing.png`,fullPage:true});

    await page.goto('/access.html?mode=login');
    await expect(page.locator('#loginForm')).toBeVisible();
    expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth)).toBeLessThanOrEqual(1);

    // Sandbox exists only for the hidden self-test: no real Supabase account is touched.
    await page.goto('/learn.html?sandbox=1');
    await expect(page.locator('body')).not.toHaveClass(/auth-locked/);
    for(const screen of ['pathScreen','playScreen','practiceScreen','leagueScreen','profileScreen']){
      await page.locator(`.bottom-tabs [data-screen="${screen}"]`).click({force:true});
      await expect(page.locator(`#${screen}`)).toHaveClass(/active/);
      expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth),`${screen} horizontal overflow`).toBeLessThanOrEqual(1);
    }
    await page.screenshot({path:`test-results/mobile-${width}-profile.png`,fullPage:true});
    expect(pageErrors).toEqual([]);
  });
}
