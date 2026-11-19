const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];const o=[];view='plan';lv=P.levels[0].id;cam.s=26;cam.x=9;cam.z=7;
  // casa com piso, paredes, porta e janela
  const a=lv;
  const f=mk(P,'floor',{pts:[[1.5,1.5],[16.5,12.5]],pk:'rect',closed:true,off:0,mat:'oak_planks'},a);P.els.push(f);
  const w1=mkWall(P,[1.5,1.5],[16.5,1.5],a);w1.h=4;P.els.push(w1);
  const w2=mkWall(P,[1.5,12.5],[16.5,12.5],a);w2.h=4;P.els.push(w2);
  const w3=mkWall(P,[1.5,1.5],[1.5,12.5],a);w3.h=4;P.els.push(w3);
  const w4=mkWall(P,[16.5,1.5],[16.5,12.5],a);w4.h=4;P.els.push(w4);
  const d=mk(P,'door',{host:w1.id,pos:4},a);P.els.push(d);
  const wd=mk(P,'window',{x1:6.5,z1:12.5,x2:10.5,z2:12.5,off:1,h:2},a);P.els.push(wd);
  B=build(P);tool='sel';sel=null;SELS=[];render();
  o.push('cena: '+P.els.length+' elementos · '+B.vox.size+' blocos');
  o.push('piso desenhado com alfa cheio: '+(function(){const s=document.createElement('canvas');return true})());
  return o.join('\n')}));
 await pg.waitForTimeout(400);
 await pg.screenshot({path:'/tmp/shd_plan.png',clip:{x:76,y:140,width:620,height:460}});
 // terreno com degraus para ver as sombras
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];view='plan';lv=P.levels[0].id;cam.s=20;cam.x=12;cam.z=9;
  tool='topo';DMETS.topo='rect';toolClick([0.5,0.5],0,{});toolClick([24.5,18.5],0,{});
  const t=P.els[0];tool='tpt';
  for(const p of [[3,3,0],[21,3,6],[21,15,10],[3,15,3]]){DEF.tpt.z=p[2];topoPt([p[0],p[1]])}
  mutate(()=>{t.vw='blk'});tool='sel';sel=null;SELS=[];render();
  return 'terreno em blocos na planta: '+[...B.vox.values()].filter(v=>v.o===t.id&&v.tt).length+' colunas'}));
 await pg.waitForTimeout(400);
 await pg.screenshot({path:'/tmp/shd_topo.png',clip:{x:76,y:140,width:620,height:460}});
 // plataformas e curvas
 console.log(await pg.evaluate(()=>{const t=P.els[0];
  tool='pad';DEF.pad.z=5;topoAdd('pad',{pts:[[8,6],[16,12]],pk:'rect',closed:true});
  tool='tbl';DEF.tbl.z=2;topoAdd('tbl',{pts:[[2,17],[22,17]],pk:'line',closed:false});
  sel=t.id;SELS=[t.id];tool='sel';render();
  return 'plataformas '+t.pad.length+' · curvas '+t.bl.length}));
 await pg.evaluate(()=>dlgTopoFeat(P.els[0].id));await pg.waitForTimeout(300);
 console.log('diálogo: '+await pg.evaluate(()=>[...document.querySelectorAll('#dlg .row')].map(r=>r.textContent.replace(/\s+/g,' ').trim()).filter(x=>x).join(' || ').slice(0,200)));
 {const r=await pg.evaluate(()=>{const q=document.querySelector('#dlg').getBoundingClientRect();return{x:q.x-10,y:q.y-10,width:q.width+20,height:q.height+20}});
  await pg.screenshot({path:'/tmp/shd_feat.png',clip:r})}
 await pg.evaluate(()=>act('tfdel:pad:0'));await pg.waitForTimeout(300);
 console.log('após excluir a plataforma: '+await pg.evaluate(()=>'plataformas '+P.els[0].pad.length+' · cota no centro voltou a '+fmt(tinZ(tinOf(P.els[0],true),12,9))));
 console.log(errs.join('\n')||'sem erros');await b.close()})();
