const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1000,height:700},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);
 const o=await pg.evaluate(()=>{openP(newProject());P.els=[];const a=P.levels[0].id,r=[];
  const w1=mkWall(P,[0.5,0.5],[10.5,0.5],a),w2=mkWall(P,[10.5,0.5],[10.5,8.5],a),w3=mkWall(P,[0.5,0.5],[0.5,8.5],a);
  [w1,w2,w3].forEach(w=>{w.h=3;P.els.push(w)});
  const f=mk(P,'fence',{x1:0.5,z1:8.5,x2:10.5,z2:8.5},a);P.els.push(f);
  const c=mk(P,'column',{x1:5.5,z1:4.5,h:3},a);P.els.push(c);
  window.__e={w1,w2,w3,f,c};B=build(P);view='plan';lv=a;cam.s=28;cam.x=5.5;cam.z=4.5;
  // seleção múltipla + hover em outro elemento
  sel=w1.id;SELS=[w1.id,w2.id];tool='sel';render();hovSet(c.id);draw2d();
  r.push('seleção múltipla + cursor no pilar: EHOV='+(EHOV===c.id));
  // ferramenta Aparar: só elementos de linha
  tool='trim';r.push('Aparar -> parede: '+hovOk(w1.id)+' | pilar: '+hovOk(c.id)+' | cerca: '+hovOk(f.id));
  // elemento oculto não acende
  tool='sel';hideSel([f.id]);r.push('cerca oculta: '+hovOk(f.id));unhideAll();
  tool='sel';sel=w1.id;SELS=[w1.id,w2.id];render();hovSet(null);hovSet(c.id);draw2d();return r.join('\n')});
 console.log(o);
 await pg.waitForTimeout(200);await pg.screenshot({path:'/tmp/hi_multi.png',clip:{x:70,y:140,width:620,height:430}});
 await pg.evaluate(()=>{document.documentElement.dataset.theme='light';applyTheme();render();hovSet(__e.c.id);draw2d()});
 await pg.waitForTimeout(300);await pg.screenshot({path:'/tmp/hi_light.png',clip:{x:70,y:140,width:620,height:430}});
 console.log(errs.join('\n')||'sem erros');await b.close()})();
