const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1366,height:880},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];const o=[];view='plan';lv=P.levels[0].id;cam.s=14;cam.x=20;cam.z=16;
  tool='topo';DMETS.topo='rect';toolClick([0.5,0.5],0,{});toolClick([40.5,32.5],0,{});
  const t=P.els[0];tool='tpt';
  for(const p of [[5,5,2],[35,5,6],[35,27,14],[5,27,8],[20,16,12]]){DEF.tpt.z=p[2];topoPt([p[0],p[1]])}
  // casa sobre o terreno, apoiada na cota dos blocos
  const yb=Math.round(topoZ(20,16));
  mutate(()=>{for(const[a,b2] of [[[14.5,12.5],[26.5,12.5]],[[14.5,12.5],[14.5,20.5]],[[26.5,12.5],[26.5,20.5]],[[14.5,20.5],[26.5,20.5]]]){
    const w=mkWall(P,a,b2,lv);w.h=4;w.off=yb+1;P.els.push(w)}});
  const tb=[...B.vox.values()].filter(v=>v.o===t.id).length;
  o.push('terreno em blocos: '+tb+' · total no projeto '+B.vox.size+' · casa na cota '+(yb+1));
  // seleção por bloco do terreno
  const any=[...B.vox.values()].find(v=>v.tp&&v.y>=0&&v.y<2);
  o.push('clicar num bloco do terreno seleciona o Terreno: '+(any?pick2([any.x+.5,any.z+.5])===t.id:'n/d'));
  mutate(()=>{t.vw='blk'});sel=t.id;SELS=[t.id];tool='sel';render();
  return o.join('\n')}));
 await pg.waitForTimeout(400);
 await pg.screenshot({path:'/tmp/blk_plan.png',clip:{x:76,y:140,width:820,height:620}});
 console.log(await pg.evaluate(()=>{mutate(()=>{P.els[0].vw='hyp'});
  const id=uid();P.views.push({id,name:'Corte no terreno',lv,x1:1,z1:16,x2:40,z2:16,L:[0,-1],tc:-16,ua:1,ub:40,cut:true});
  SV={id,cam:null};view='sec';render();return 'corte com blocos: '+(SV.cam?'ok':'sem câmera')}));
 await pg.waitForTimeout(400);
 await pg.screenshot({path:'/tmp/blk_sec.png',clip:{x:76,y:140,width:900,height:560}});
 console.log(errs.join('\n')||'sem erros');await b.close()})();
