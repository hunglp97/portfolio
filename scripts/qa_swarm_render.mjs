// Visual behavior checks for the supplied Swarm Rebuild reference.
import {homedir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
const {Browser,sleep}=await import(pathToFileURL(join(process.env.TASTE_SKILL_HOME || join(homedir(), '.codex/skills/design-taste-frontend'),'scripts/lib/cdp.mjs')));
const base=process.argv[2] || 'http://127.0.0.1:8765/';
import {mkdirSync,writeFileSync} from 'node:fs';
const b=await Browser.launch(),checks=[];const check=(ok,name)=>{checks.push({ok:!!ok,name});if(!ok)console.error('FAIL',name);};
const out='.taste-skill/swarm-choreography';mkdirSync(out,{recursive:true});
for(const width of [1440,768,390]){
 const p=await b.newPage({width,height:1000,mobile:width<600});
 await p.send('Storage.clearDataForOrigin',{origin:new URL(base).origin,storageTypes:'local_storage'});
 await p.send('Network.enable');await p.send('Network.setBlockedURLs',{urls:['*cloud.umami.is*','*payhip.com*','*fonts.googleapis.com*','*fonts.gstatic.com*','*unpkg.com*']});
 await p.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'light'},{name:'prefers-reduced-motion',value:'reduce'}]});
 await p.send('Page.addScriptToEvaluateOnNewDocument',{source:`window.qaFrames=[];document.addEventListener('DOMContentLoaded',()=>{let count=0;const capture=()=>{const h=document.querySelector('h1');const item=document.querySelector('.data-inspector');window.qaFrames.push({t:performance.now(),intro:document.documentElement.hasAttribute('data-page-build-intro'),main:getComputedStyle(document.querySelector('main')).opacity,hText:h.textContent,hState:h.dataset.buildState,hScale:getComputedStyle(h).scale,hMask:getComputedStyle(h).maskSize,hBox:h.getBoundingClientRect().toJSON(),frame:item.dataset.buildSurface,child:item.querySelector('.inspector-art').dataset.buildState,draw:[...document.querySelectorAll('.page-build-guide')].filter(e=>e.style.opacity==='1').map(e=>({w:e.style.width,h:e.style.height})),duplicates:!!document.querySelector('[data-build-phase=duplicate]')});if(++count<260)requestAnimationFrame(capture)};requestAnimationFrame(capture)});`});
 await p.goto(base,{settleMs:120});await p.screenshot({path:`${out}/${width}-orbit.jpg`});
 await sleep(1500);await p.screenshot({path:`${out}/${width}-draw.jpg`});
 await sleep(700);await p.screenshot({path:`${out}/${width}-type.jpg`});
 await sleep(3500);await p.screenshot({path:`${out}/${width}-complete.jpg`});
 const frames=await p.eval('window.qaFrames');writeFileSync(`${out}/${width}-frames.json`,JSON.stringify(frames));
 check(frames.some(f=>f.intro&&f.main==='0'),width+': the site starts as a blank canvas');
 check(frames.some(f=>f.frame==='building'&&f.child==='pending'),width+': structural frame is drawn before its media');
 check(frames.some(f=>f.hState==='building'&&parseFloat(f.hScale)<.7),width+': title starts small');
 check(frames.some(f=>f.hState==='building'&&parseFloat(f.hScale)>.9),width+': title is enlarged after typing');
 check(new Set(frames.filter(f=>f.hState==='building').map(f=>f.hMask)).size>5,width+': glyphs are typed incrementally');
 check(new Set(frames.map(f=>f.hText)).size===1,width+': real text is never rewritten');
 check(frames.some(f=>f.draw.some(d=>parseFloat(d.w)>50&&parseFloat(d.w)<500)),width+': drag creates growing geometry');
 check(await p.eval('document.querySelector("h1").dataset.buildState==="done"'),width+': title finishes');
 const text=await p.eval('document.querySelector("main").textContent');
 await p.eval('document.querySelector("#datasets").scrollIntoView({behavior:"instant"})');
 let duplicate=false;for(let i=0;i<100&&!duplicate;i++){await sleep(100);duplicate=await p.eval('!!document.querySelector("[data-build-phase=duplicate]")');}
 check(duplicate,width+': repeated items are dragged from a built master');
 await p.screenshot({path:`${out}/${width}-duplicate.jpg`});
 await p.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});
 check(await p.eval(t=>document.querySelector('main').textContent===t,text),width+': complete native copy preserved');
 check(await p.eval('!document.querySelector("[data-build-state=pending],[data-build-state=building],[data-build-surface=pending],[data-build-surface=building],[data-build-surface=painting]")'),width+': skip clears all unfinished layers');
 check(await p.eval('document.documentElement.scrollWidth<=innerWidth'),width+': no horizontal overflow');
 check(p.consoleErrors.length===0,width+': no exceptions');await p.send('Page.close');
}
await b.close();writeFileSync(out+'/results.json',JSON.stringify(checks,null,2));console.log(checks.filter(x=>x.ok).length+'/'+checks.length+' choreography checks passed');process.exit(checks.some(x=>!x.ok)?1:0);
