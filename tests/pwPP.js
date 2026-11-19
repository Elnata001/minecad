const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:820}});
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];const a=P.levels[0].id,o=[];
  const w=mkWall(P,[0.5,0.5],[8.5,0.5],a);w.h=3;P.els.push(w);
  const c=mk(P,'column',{x1:3.5,z1:4.5,h:3},a);P.els.push(c);
  const bl=mk(P,'block',{x1:6.5,z1:4.5},a);P.els.push(bl);
  const fc=mk(P,'fence',{x1:0.5,z1:6.5,x2:5.5,z2:6.5,h:1},a);P.els.push(fc);
  B=build(P);view='plan';lv=a;tool='sel';render();
  const h=()=>{const pp=document.querySelector('#pp'),ps=pp.querySelector('.pps');
   return pp.offsetHeight+'px (pps '+ps.offsetHeight+', rola '+(ps.scrollWidth>ps.clientWidth)+')'};
  for(const[n,id]of [['parede',w.id],['pilar',c.id],['bloco',bl.id],['cerca',fc.id]]){sel=id;SELS=[id];render();o.push(n+': '+h())}
  tool='wall';render();o.push('ferramenta parede: '+h());
  tool='sel';sel=null;SELS=[];view='3d';render();o.push('vista 3D sem seleção: '+h());
  return o.join('\n')}));
 await b.close()})();
