const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860},deviceScaleFactor:2});
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 await pg.evaluate(()=>{dlgPack();document.activeElement&&document.activeElement.blur&&document.activeElement.blur()});await pg.waitForTimeout(300);
 const el=await pg.$('#dlg');await el.screenshot({path:'/tmp/dlg_pack.png'});
 await b.close()})();
