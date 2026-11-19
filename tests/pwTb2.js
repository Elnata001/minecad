const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:600},deviceScaleFactor:4});
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 const bb=await (await pg.$('#tools .tl[data-a="tool:wall"]')).boundingBox();
 await pg.screenshot({path:'/tmp/tb2.png',clip:{x:bb.x-4,y:bb.y-4,width:bb.width+28,height:bb.height+8}});
 console.log(await pg.evaluate(()=>{const d=document.querySelector('#tools .tl[data-a="tool:wall"] .gdot');if(!d)return'sem gdot';
  const c=getComputedStyle(d),r=d.getBoundingClientRect();return `gdot ${Math.round(r.width)}x${Math.round(r.height)} em ${Math.round(r.left)},${Math.round(r.top)} cor ${c.backgroundColor} sombra ${c.boxShadow}`}));
 await b.close()})();
