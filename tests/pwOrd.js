const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:760}});
 pg.on('pageerror',e=>console.log('ERRO',e.message.slice(0,90)));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 console.log(await pg.evaluate(()=>Object.keys(SCH).filter(c=>CATS[c]).map(c=>
  (CATS[c].l+':').padEnd(18)+'Nome, '+SCH[c].map(f=>f[1].replace(/ \(.*\)| \(Espaço.*\)/,'')).join(', ')).join('\n')));
 await b.close()})();
