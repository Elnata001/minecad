const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:600}});
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(700);
 console.log(await pg.evaluate(()=>{const d=document.querySelector('#tools .tl .gdot');
  const out=[];for(const ss of document.styleSheets){let rs;try{rs=ss.cssRules}catch(e){continue}
   for(const r of rs){if(r.selectorText&&d.matches&&(()=>{try{return d.matches(r.selectorText)}catch(e){return false}})())out.push(r.selectorText+' {'+r.style.cssText+'}')}}
  const c=getComputedStyle(d);
  return out.join('\n')+'\n--> display '+c.display+' pos '+c.position+' w '+c.width+' h '+c.height}));
 await b.close()})();
