const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage();
 pg.on('pageerror',e=>console.log('PAGEERROR:',e.message,'\n',(e.stack||'').split('\n').slice(0,4).join('\n')));
 pg.on('console',m=>{if(m.type()==='error')console.log('CONSOLE:',m.text().slice(0,200))});
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 console.log('UIREADY=',await pg.evaluate(()=>typeof UIREADY!=='undefined'?UIREADY:'n/d').catch(e=>e.message));
 await b.close()})();
