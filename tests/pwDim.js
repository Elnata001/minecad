const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860}});
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 console.log(await pg.evaluate(()=>{openP(newProject());tool='dim';render();
  const ps=document.querySelector('#pp .pps');
  return [...ps.children].map(c=>c.className+' '+c.tagName+' h='+c.offsetHeight+' :: '+c.textContent.trim().slice(0,70)).join('\n')}));
 await b.close()})();
