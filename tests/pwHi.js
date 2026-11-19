const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);
 const r=await pg.evaluate(()=>{openP(newProject());P.els=[];
  const a=P.levels[0].id,b2=P.levels[1].id,o=[];
  const w=mkWall(P,[0.5,0.5],[0.5,7.5],a);w.h=3;w.top=b2;P.els.push(w);
  const w2b=mkWall(P,[0.5,0.5],[11.5,0.5],a);w2b.h=3;P.els.push(w2b);
  const rf=mk(P,'roof',{pts:[[0.5,0.5],[11.5,0.5],[11.5,7.5],[0.5,7.5]],sp:1,base:b2,off:0},b2);P.els.push(rf);
  window.__w=w;window.__w2=w2b;window.__r=rf;B=build(P);
  // 1. seleção
  sel=w.id;SELS=[w.id];view='3d';render();
  o.push('seleção no 3D: peças='+OVM.filter(x=>!x.__own).reduce((n,x)=>n+x.count,0)+' · contornos='+OVM.filter(x=>x.__own).length);
  // 2. hover em elemento selecionável (ferramenta Selecionar)
  tool='sel';g3up({id:w2b.id,out:[1,1,1],in:[1,0,1]});
  o.push('cursor sobre a outra parede: camadas='+OVM.length+' · EHOV='+(EHOV===w2b.id));
  // 3. ferramenta de desenho: nada deve acender
  tool='wall';hovSet(null);hovSet(w2b.id);
  o.push('com a ferramenta Parede ativa: EHOV='+EHOV+' (hovOk='+hovOk(w2b.id)+')');
  // 4. anexar topo: só hospedeiros válidos
  tool='sel';sel=w.id;SELS=[w.id];ATTP=w.id;EHOV=EHOVR=null;
  o.push('anexar topo -> cobertura: '+hovOk(rf.id)+' | outra parede: '+hovOk(w2b.id)+' | ela mesma: '+hovOk(w.id));
  hovSet(rf.id);hi3();
  o.push('destaque do alvo: peças='+OVM.filter(x=>!x.__own).reduce((n,x)=>n+x.count,0)+' · contornos='+OVM.filter(x=>x.__own).length);
  // 5. cobertura que não passa por cima da parede
  const rf2=mk(P,'roof',{pts:[[20.5,20.5],[26.5,20.5],[26.5,26.5],[20.5,26.5]],sp:1,base:b2,off:0},b2);P.els.push(rf2);B=build(P);
  o.push('cobertura distante (não cobre a parede): '+hovOk(rf2.id));
  mutate(()=>{P.els=P.els.filter(e=>e.id!==rf2.id)});
  ATTP=null;EHOV=EHOVR=null;hi3();
  return o.join('\n')});
 console.log(r);
 // screenshots
 await pg.evaluate(()=>{view='3d';sel=__w.id;SELS=[__w.id];tool='sel';render();o.th=.9;o.ph=1;o.r=22;o.t.set(6,2,4);draw3d()});
 await pg.waitForTimeout(400);await pg.screenshot({path:'/tmp/hi_3d_sel.png'});
 await pg.evaluate(()=>{g3up({id:__w2.id,out:[4,1,0],in:[4,0,0]});draw3d()});
 await pg.waitForTimeout(300);await pg.screenshot({path:'/tmp/hi_3d_hov.png'});
 await pg.evaluate(()=>{ATTP=__w.id;tool='sel';EHOV=EHOVR=null;hovSet(__r.id);hi3();draw3d()});
 await pg.waitForTimeout(300);await pg.screenshot({path:'/tmp/hi_3d_att.png'});
 await pg.evaluate(()=>{ATTP=null;EHOV=EHOVR=null;hi3();view='plan';lv=P.levels[0].id;sel=__w.id;SELS=[__w.id];cam.s=22;cam.x=6;cam.z=4;render()});
 await pg.waitForTimeout(300);await pg.screenshot({path:'/tmp/hi_2d_sel.png'});
 await pg.evaluate(()=>{hovSet(__w2.id);draw2d()});
 await pg.waitForTimeout(250);await pg.screenshot({path:'/tmp/hi_2d_hov.png'});
 console.log(errs.join('\n')||'sem erros');await b.close()})();
