const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];view='plan';lv=P.levels[0].id;
  tool='topo';DMETS.topo='rect';toolClick([0.5,0.5],0,{});toolClick([20.5,16.5],0,{});
  const t=P.els[0];tool='tpt';
  for(const p of [[4,4,2],[16,4,2],[16,12,2],[4,12,2]]){DEF.tpt.z=p[2];topoPt([p[0],p[1]])}
  view='3d';tedStart(t.id);render();return 'preparado: '+TDM.length+' marcadores'}));
 // arraste vertical real com Alt
 const r=await pg.evaluate(()=>{const q=document.querySelector('#v3').getBoundingClientRect();return{x:q.x+q.width/2,y:q.y+q.height/2}});
 await pg.evaluate(()=>{window.__HIT3=[{object:TDM[0],point:{x:4,y:2,z:4},distance:5}]});
 await pg.mouse.move(r.x,r.y);await pg.keyboard.down('Alt');await pg.mouse.down();
 await pg.mouse.move(r.x,r.y-56,{steps:4});await pg.mouse.up();await pg.keyboard.up('Alt');
 await pg.waitForTimeout(250);
 console.log('1. Alt+arraste no 3D: cota do ponto 0 = '+await pg.evaluate(()=>P.els[0].tp[0][2])+' (era 2) · seleção '+await pg.evaluate(()=>JSON.stringify(TED&&TED.sel)));
 console.log('   histórico: uma entrada por arraste = '+await pg.evaluate(()=>H.length)+' · desfazer devolve '+await pg.evaluate(()=>{undo();return P.els[0].tp[0][2]}));
 await pg.evaluate(()=>{redo()});
 // arraste horizontal
 await pg.evaluate(()=>{window.__HIT3=[{object:TDM[0],point:{x:4,y:2,z:4},distance:5}]});
 const p0=await pg.evaluate(()=>P.els[0].tp[0].slice());
 await pg.mouse.move(r.x,r.y);await pg.mouse.down();await pg.mouse.move(r.x+40,r.y+30,{steps:4});await pg.mouse.up();
 await pg.waitForTimeout(250);
 console.log('2. arraste horizontal: '+JSON.stringify(p0)+' -> '+await pg.evaluate(()=>JSON.stringify(P.els[0].tp[0]))+' (move no plano, cota preservada)');
 console.log('3. clique fora limpa a seleção: '+await pg.evaluate(()=>{window.__HIT3=[];const ev=new PointerEvent('pointerup',{button:0,clientX:300,clientY:300,bubbles:true});
   drag={x:300,y:300,b:0,mv:0};document.querySelector('#v3').onpointerup(ev);return JSON.stringify(TED.sel)}));
 console.log(errs.join('\n')||'sem erros');await b.close()})();
