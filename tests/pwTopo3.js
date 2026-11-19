const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1366,height:880},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];const o=[];view='plan';lv=P.levels[0].id;cam.s=13;cam.x=22;cam.z=18;
  tool='topo';DMETS.topo='rect';toolClick([0.5,0.5],[0.5,0.5],{});toolClick([44.5,36.5],[44.5,36.5],{});
  const t=P.els[0];tool='tpt';
  for(const p of [[6,6,2],[38,6,6],[38,30,16],[6,30,10],[22,18,13],[30,12,9],[12,24,7]]){DEF.tpt.z=p[2];topoPt([p[0],p[1]])}
  mutate(()=>{t.eq=1;t.mi=5;t.name='Terreno natural'});
  tool='pad';DEF.pad.z=11;topoAdd('pad',{pts:[[16,14],[30,24]],pk:'rect',closed:true});
  // casa sobre o terreno, apoiada na cota consultada
  const yb=Math.round(topoZ(23,19));
  mutate(()=>{const w=mkWall(P,[18.5,16.5],[28.5,16.5],lv);w.h=4;w.off=yb;P.els.push(w);
   const w2=mkWall(P,[18.5,16.5],[18.5,22.5],lv);w2.h=4;w2.off=yb;P.els.push(w2)});
  o.push('casa apoiada na cota do terreno: Y '+yb+' (consulta do serviço central)');
  sel=t.id;SELS=[t.id];tool='sel';render();
  const q=tinOf(t);
  o.push('terreno: '+q.T.length+' triângulos · '+t.tp.length+' pontos · área 3D '+fmt(q.a3)+' · curvas '+tinCntC(q,1,0).length+' níveis');
  return o.join('\n')}));
 await pg.waitForTimeout(500);
 await pg.screenshot({path:'/tmp/topo_full.png',clip:{x:76,y:120,width:960,height:700}});
 // propriedades
 console.log('propriedades: '+await pg.evaluate(()=>[...document.querySelectorAll('#pp .chip')].map(c=>c.textContent).join(' | ').slice(0,400)));
 // corte
 console.log(await pg.evaluate(()=>{const id=uid();
  P.views.push({id,name:'Corte topográfico',lv,x1:2,z1:19,x2:44,z2:19,L:[0,-1],tc:-19,ua:2,ub:44,cut:true});
  SV={id,cam:null};view='sec';render();return 'corte gerado: '+(SV.cam?'sim':'não')}));
 await pg.waitForTimeout(400);
 await pg.screenshot({path:'/tmp/topo_sec.png',clip:{x:76,y:120,width:960,height:520}});
 console.log(errs.join('\n')||'sem erros');await b.close()})();
