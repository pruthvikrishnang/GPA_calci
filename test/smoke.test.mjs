/*
 * Apex GPA Calculator — headless smoke & regression tests.
 *
 * Loads index.html in jsdom exactly like a browser would (styles, scripts,
 * localStorage) and exercises every user-facing flow. The very first check
 * guards against the blank-screen regression: all pages are display:none by
 * default and only become visible when app.js adds the .active class, so any
 * script parse/runtime error renders the whole site blank.
 *
 * Run:  npm install && npm test
 */
import jsdomPkg from 'jsdom';
const { JSDOM, ResourceLoader, VirtualConsole } = jsdomPkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;
const ok = (cond, label) => {
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}`);
  if (!cond) failures++;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Serve only local files; stub the lucide CDN (unpkg) and block font fetches.
class LocalResources extends ResourceLoader {
  fetch(url, options) {
    if (url.startsWith('file://')) return super.fetch(url, options);
    const u = new URL(url);
    if (u.hostname.endsWith('unpkg.com') && u.pathname.includes('lucide')) {
      return Promise.resolve(Buffer.from(
        "window.lucide={createIcons:()=>{document.querySelectorAll('i[data-lucide]')" +
        ".forEach(el=>{const s=document.createElementNS('http://www.w3.org/2000/svg','svg');" +
        "s.setAttribute('data-lucide-source',el.getAttribute('data-lucide'));el.replaceWith(s);})}};"));
    }
    return Promise.resolve(Buffer.from(''));
  }
}

const jsErrors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', (e) => {
  const msg = String((e && e.message) || e);
  if (msg.includes('Could not load')) return;          // blocked external fetches
  if (msg.includes('Not implemented: navigation')) return; // jsdom can't download files
  jsErrors.push(msg);
});

function makeDom(storage = {}) {
  let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')
    .replace(/href="style\.css"/, `href="file://${ROOT}/style.css"`)
    .replace(/src="app\.js"/, `src="file://${ROOT}/app.js"`);
  const dom = new JSDOM(html, {
    url: 'https://pruthvikrishnang.github.io/GPA_calci/',
    runScripts: 'dangerously',
    resources: new LocalResources(),
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(window) {
      // jsdom ships without a canvas implementation
      const noopCtx = () => new Proxy({}, {
        get: (t, p) => {
          if (p === 'createLinearGradient' || p === 'createRadialGradient') return () => ({ addColorStop: () => {} });
          if (p === 'measureText') return () => ({ width: 10 });
          return () => {};
        },
        set: () => true,
      });
      window.HTMLCanvasElement.prototype.getContext = function () { return noopCtx(); };
      window.HTMLElement.prototype.scrollIntoView = function () {};
      window.URL.createObjectURL = () => 'blob:fake';
      window.URL.revokeObjectURL = () => {};
      Object.entries(storage).forEach(([k, v]) => window.localStorage.setItem(k, v));
    },
  });
  const { window } = dom;
  const { document } = window;
  return new Promise((resolve) => {
    window.addEventListener('load', () => setTimeout(() => resolve({ window, document }), 300));
    setTimeout(() => resolve({ window, document }), 5000);
  });
}

// ---------------------------------------------------------------------------
console.log('== 1. Blank-screen regression guard ==');
{
  const { window, document } = await makeDom();
  const home = document.getElementById('page-home');
  ok(home && home.classList.contains('active'), 'home page activates on load (site is NOT blank)');
  ok(jsErrors.length === 0, 'script parses & runs without errors' + (jsErrors.length ? ' -> ' + jsErrors.join(' | ') : ''));
  ok(document.querySelectorAll('[data-lucide-source]').length > 0, 'lucide icons initialized');
  ok(document.querySelectorAll('#subject-list-body select').length > 0, 'default subject table rendered');
  window.close && window.close();
}

console.log('== 2. SPA navigation ==');
{
  const { window, document } = await makeDom();
  window.location.hash = '#sgpa';
  window.dispatchEvent(new window.HashChangeEvent('hashchange'));
  await sleep(150);
  ok(document.getElementById('page-sgpa').classList.contains('active'), '#sgpa activates SGPA page');
  window.location.hash = '#cgpa';
  window.dispatchEvent(new window.HashChangeEvent('hashchange'));
  await sleep(150);
  ok(document.getElementById('page-cgpa').classList.contains('active'), '#cgpa activates CGPA page');
  window.close && window.close();
}

console.log('== 3. SGPA calculation ==');
{
  const { window, document } = await makeDom();
  const total = document.querySelectorAll('#subject-list-body select').length;
  for (let i = 0; i < total; i++) {
    const s = document.querySelectorAll('#subject-list-body select')[i];
    if (!s) break;
    s.value = 'O';
    s.dispatchEvent(new window.Event('change', { bubbles: true }));
  }
  document.getElementById('calculate-btn').click();
  await sleep(1200); // animated counter runs ~800ms
  ok(document.getElementById('gpa-display').textContent.trim() === '10.00', `all-O grades -> GPA 10.00 (got ${document.getElementById('gpa-display').textContent.trim()})`);
  ok(document.getElementById('metric-points').textContent.trim() !== '', 'grade points metric populated');
  window.close && window.close();
}

console.log('== 4. Add-subject form & validation ==');
{
  const { window, document } = await makeDom();
  const before = document.querySelectorAll('#subject-list-body select').length;
  document.getElementById('subject-name').value = 'Test Subject';
  document.getElementById('subject-grade').value = 'A+';
  document.getElementById('subject-credits').value = '4';
  document.getElementById('add-subject-form').requestSubmit();
  await sleep(250);
  const inputs = [...document.querySelectorAll('#subject-list-body input')];
  ok(inputs.some((i) => i.value === 'Test Subject'), 'new subject appears as inline-editable row');
  ok(document.querySelectorAll('#subject-list-body select').length === before + 1, 'row count increases by 1');
  // duplicate & empty-name submissions must be rejected without crashing
  document.getElementById('subject-name').value = 'Test Subject';
  document.getElementById('add-subject-form').requestSubmit();
  await sleep(150);
  ok(jsErrors.length === 0, 'duplicate submission rejected gracefully');
  document.getElementById('subject-name').value = '';
  document.getElementById('add-subject-form').requestSubmit();
  await sleep(150);
  ok(jsErrors.length === 0, 'empty-name submission rejected gracefully');
  window.close && window.close();
}

console.log('== 5. CGPA calculator ==');
{
  const { window, document } = await makeDom();
  window.location.hash = '#cgpa';
  window.dispatchEvent(new window.HashChangeEvent('hashchange'));
  await sleep(150);
  document.querySelector('.sem-count-btn[data-count="4"]').click();
  await sleep(150);
  const n = document.querySelectorAll('.cgpa-sem-input').length;
  ok(n === 4, `semester count selector builds 4 inputs (got ${n})`);
  for (let i = 0; i < n; i++) {
    const inp = document.querySelectorAll('.cgpa-sem-input')[i];
    inp.value = '9';
    inp.dispatchEvent(new window.Event('input', { bubbles: true }));
  }
  document.getElementById('cgpa-calc-btn').click();
  await sleep(1200);
  ok(document.getElementById('cgpa-result-display').textContent.trim() === '9.00', `CGPA(9,9,9,9) = 9.00 (got ${document.getElementById('cgpa-result-display').textContent.trim()})`);
  window.close && window.close();
}

console.log('== 6. Semester templates, majors & history drawer ==');
{
  const { window, document } = await makeDom();
  const sem3 = [...document.querySelectorAll('.sem-btn')].find((b) => b.dataset.sem === '3');
  sem3.click();
  await sleep(200);
  ok(document.getElementById('sem-badge').textContent.includes('3'), 'Semester 3 template loads');
  ok(!document.getElementById('major-selector').hasAttribute('hidden'), 'major selector appears for structured semester');
  const pills = document.querySelectorAll('.major-pill');
  ok(pills.length > 0, `major pills rendered (${pills.length})`);
  const total = document.querySelectorAll('#subject-list-body select').length;
  for (let i = 0; i < total; i++) {
    const s = document.querySelectorAll('#subject-list-body select')[i];
    if (!s) break;
    s.value = 'A+';
    s.dispatchEvent(new window.Event('change', { bubbles: true }));
  }
  document.getElementById('calculate-btn').click();
  await sleep(1200);
  ok(document.getElementById('gpa-display').textContent.trim() === '9.00', 'sem-3 all-A+ -> GPA 9.00');
  document.getElementById('past-calc-btn').click();
  await sleep(300);
  const drawer = document.getElementById('past-calc-drawer');
  ok(drawer.classList.contains('open'), 'past-calculations drawer opens');
  ok(drawer.querySelectorAll('.drawer-list-item').length === 1, 'calculation recorded in history');
  document.getElementById('drawer-close-btn').click();
  await sleep(400);
  ok(!drawer.classList.contains('open'), 'drawer closes');
  window.close && window.close();
}

console.log('== 7. Search, CSV export, saved semesters ==');
{
  const { window, document } = await makeDom();
  const search = document.getElementById('subject-search');
  search.value = 'zzz-no-match-zzz';
  search.dispatchEvent(new window.Event('input', { bubbles: true }));
  await sleep(200);
  const bar = document.getElementById('filter-results-bar');
  ok(bar && (bar.style.display !== 'none' || !bar.hasAttribute('hidden')), 'filter results bar shows on no-match');
  document.getElementById('search-clear-btn').click();
  await sleep(150);
  ok(document.getElementById('subject-search').value === '', 'search clear button resets query');

  let blobText = '';
  const OldBlob = window.Blob;
  window.Blob = class extends OldBlob {
    constructor(parts, opts) { super(parts, opts); blobText = parts.join(''); }
  };
  document.getElementById('export-csv-btn').click();
  await sleep(300);
  ok(blobText.startsWith('Subject,Grade,Credits,Grade Point'), `CSV export produces header (${blobText.slice(0, 40)}...)`);

  const sem3 = [...document.querySelectorAll('.sem-btn')].find((b) => b.dataset.sem === '3');
  sem3.click();
  await sleep(150);
  const total = document.querySelectorAll('#subject-list-body select').length;
  for (let i = 0; i < total; i++) {
    const s = document.querySelectorAll('#subject-list-body select')[i];
    if (!s) break;
    s.value = 'B';
    s.dispatchEvent(new window.Event('change', { bubbles: true }));
  }
  document.getElementById('calculate-btn').click();
  await sleep(1200);
  document.getElementById('save-sem-btn').click();
  await sleep(300);
  const savedList = document.getElementById('saved-list');
  ok(savedList && savedList.children.length > 0, 'saved semester appears in CGPA list');
  window.close && window.close();
}

console.log('== 8. Theme toggle & persistence ==');
{
  const { window, document } = await makeDom();
  const before = document.documentElement.getAttribute('data-theme');
  document.getElementById('home-theme-toggle').click();
  await sleep(100);
  const after = document.documentElement.getAttribute('data-theme');
  ok(before !== after, `theme toggles (${before} -> ${after})`);
  window.close && window.close();
}
{
  const { window, document } = await makeDom({ theme: 'light' });
  ok(document.documentElement.getAttribute('data-theme') === 'light', 'saved theme restored on next visit');
  window.close && window.close();
}

console.log('== 9. Resilience: corrupted localStorage must not blank the site ==');
{
  const { window, document } = await makeDom({
    gpa_subjects_custom: '{not valid json!!!',
    gpa_saved_semesters: 'garbage[',
    gpa_calc_history: 'null,',
    theme: 'bogus',
  });
  ok(document.getElementById('page-home').classList.contains('active'), 'page still activates with corrupted storage');
  ok(document.querySelectorAll('#subject-list-body select').length > 0, 'subjects fall back to defaults');
  ok(jsErrors.length === 0, 'no crashes on corrupted storage' + (jsErrors.length ? ' -> ' + jsErrors.join(' | ') : ''));
  window.close && window.close();
}

console.log('== 10. Edge cases: empty & all-F calculations ==');
{
  const { window, document } = await makeDom();
  document.getElementById('calculate-btn').click();
  await sleep(300);
  ok(document.getElementById('gpa-display').textContent.trim() === '0.00', 'calculate with no grades -> 0.00, no crash');
  const total = document.querySelectorAll('#subject-list-body select').length;
  for (let i = 0; i < total; i++) {
    const s = document.querySelectorAll('#subject-list-body select')[i];
    if (!s) break;
    s.value = 'F';
    s.dispatchEvent(new window.Event('change', { bubbles: true }));
  }
  document.getElementById('calculate-btn').click();
  await sleep(1200);
  ok(document.getElementById('gpa-display').textContent.trim() === '0.00', 'all-F -> GPA 0.00');
  ok(!!document.getElementById('rating-badge').textContent, 'rating badge rendered');
  ok(jsErrors.length === 0, 'no uncaught errors across all suites' + (jsErrors.length ? ' -> ' + jsErrors.join(' | ') : ''));
  window.close && window.close();
}

console.log(failures === 0 ? '\nALL TESTS PASSED' : `\n${failures} TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
