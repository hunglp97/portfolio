// Persistent first-visit policy, including browser restarts and unavailable storage.
import {homedir,tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdtempSync,rmSync,mkdirSync,writeFileSync} from 'node:fs';
const {Browser,sleep}=await import(pathToFileURL(join(process.env.TASTE_SKILL_HOME || join(homedir(),'.codex/skills/design-taste-frontend'),'scripts/lib/cdp.mjs')));
const base=process.argv[2] || 'http://127.0.0.1:8765/';
const profile=mkdtempSync(join(tmpdir(),'hlp-first-visit-'));
const results=[];const check=(ok,name)=>{results.push({ok:!!ok,name});if(!ok)console.error('FAIL '+name);};
let browser;
async function page(setup){
 const p=await browser.newPage({width:390,height:844,mobile:true});
 await p.send('Network.enable');await p.send('Network.setBlockedURLs',{urls:['*cloud.umami.is*','*payhip.com*','*fonts.googleapis.com*','*fonts.gstatic.com*','*unpkg.com*']});
 await p.send('Page.addScriptToEvaluateOnNewDocument',{source:`window.qaBlank=false;window.qaIntro=false;new MutationObserver(()=>{const main=document.querySelector('main');window.qaBlank ||= !!main && getComputedStyle(main).opacity==='0';window.qaIntro ||= !!document.documentElement && document.documentElement.hasAttribute('data-page-build-intro');}).observe(document,{subtree:true,childList:true,attributes:true,attributeFilter:['data-page-build-intro','data-page-build-boot']});`});
 if(setup)await setup(p);return p;
}
async function staticPage(p,label){
 await sleep(200);
 check(await p.eval('!document.documentElement.hasAttribute("data-page-build") && !document.documentElement.hasAttribute("data-page-build-boot")'),label+': construction never initializes');
 check(await p.eval('!document.querySelector("[data-build-state],[data-build-surface],.page-build-tools,.page-build-layer")'),label+': no hidden layers or replay UI');
 check(await p.eval('getComputedStyle(document.querySelector("main")).opacity==="1" && getComputedStyle(document.querySelector("h1")).opacity==="1"'),label+': native page is immediately readable');
 check(await p.eval('window.qaBlank===false'),label+': no blank first frame');
 await p.eval('window.scrollTo({top:document.documentElement.scrollHeight,behavior:"instant"})');await sleep(100);
 check(await p.eval('!document.querySelector("[data-build-state],[data-build-surface]")'),label+': scrolling does not start construction');
 check(p.consoleErrors.length===0,label+': no exceptions '+p.consoleErrors.join(';'));
}
try{
 browser=await Browser.launch({extraArgs:['--user-data-dir='+profile]});
 let p=await page();await p.goto(base,{settleMs:160});
 check(await p.eval('window.qaIntro===true'),'first visit: automatic intro is observed');
 check(await p.eval('localStorage.getItem("hlpdata:swarm-seen")==="1"'),'first visit: seen flag is written before completion');
 check(await p.eval('document.querySelectorAll(".page-build-agent").length===8'),'first visit: cursor swarm is present');
 // Reload while the first intro is still running: it must never start over.
 await p.goto(base,{settleMs:120});await staticPage(p,'interrupted intro reload');
 await p.goto(new URL('api.html',base).href,{settleMs:120});await staticPage(p,'same-tab page navigation');
 const q=await page();await q.goto(new URL('datasets/idealista-portugal.html',base).href,{settleMs:120});await staticPage(q,'new tab');
 await q.send('Page.close');await p.send('Page.close');
 p=await page();await p.goto(base+(base.includes('?')?'&':'?')+'revisit=another-version',{settleMs:120});await staticPage(p,'reopen with a different query');
 await p.send('Page.close');await browser.close();browser=null;
 browser=await Browser.launch({extraArgs:['--user-data-dir='+profile]});p=await page();await p.goto(base,{settleMs:120});
 check(await p.eval('localStorage.getItem("hlpdata:swarm-seen")==="1"'),'browser restart: marker persists on disk');await staticPage(p,'browser restart');await p.send('Page.close');
 // Explicitly reset only this isolated QA profile to exercise another first visit.
 p=await page();await p.send('Storage.clearDataForOrigin',{origin:new URL(base).origin,storageTypes:'local_storage'});await p.goto(base,{settleMs:120});
 await p.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});
 check(await p.eval('document.querySelector(".page-build-tools").hidden'),'skip ends the introduction and hides controls');
 check(await p.eval('![...document.querySelectorAll("button")].some(b=>/replay/i.test(b.textContent))'),'no replay button is offered');
 await p.eval('window.dispatchEvent(new PageTransitionEvent("pagehide",{persisted:true}));window.dispatchEvent(new PageTransitionEvent("pageshow",{persisted:true}))');await sleep(200);
 check(await p.eval('!document.querySelector("[data-build-state=pending],[data-build-state=building]") && !document.documentElement.hasAttribute("data-page-build-intro")'),'back-forward cache stays completely rendered');
 check(await p.eval('document.querySelector(".page-build-layer").hidden'),'back-forward cache does not restart cursors');await p.send('Page.close');
 p=await page(p=>p.send('Page.addScriptToEvaluateOnNewDocument',{source:'Object.defineProperty(window,"localStorage",{get(){throw new DOMException("QA denied storage","SecurityError")}});'}));await p.goto(base,{settleMs:120});await staticPage(p,'storage denied');await p.send('Page.close');
 p=await page(p=>p.send('Page.addScriptToEvaluateOnNewDocument',{source:'Storage.prototype.getItem=function(){return null};Storage.prototype.setItem=function(){throw new DOMException("QA full storage","QuotaExceededError")};'}));await p.goto(base,{settleMs:120});await staticPage(p,'storage write failure');await p.send('Page.close');
}finally{if(browser)await browser.close();rmSync(profile,{recursive:true,force:true});}
mkdirSync('.taste-skill/first-visit',{recursive:true});writeFileSync('.taste-skill/first-visit/results.json',JSON.stringify(results,null,2));
console.log(results.filter(x=>x.ok).length+'/'+results.length+' first-visit checks passed');process.exit(results.some(x=>!x.ok)?1:0);
