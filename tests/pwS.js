const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1300,height:850},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 // o programa abre na tela inicial: sai dela como o usuário sairia
 await pg.evaluate(()=>welClose());
 // componente modelado ao longo de Z (como quem traça na vertical da planta)
 await pg.evaluate(()=>cEnter('Módulo vertical',null));await pg.waitForTimeout(300);
 await pg.evaluate(()=>{CEDIT.cat='Paredes';
  for(let z=0;z<3;z++)for(let y=0;y<2;y++)P.els.push(mk(P,'block',{x1:.5,z1:z+.5,off:y,mat:y?'oak_planks':'stone_bricks'},lv));
  B=build(P);render()});
 await pg.click('[data-a="cdone"]');await pg.waitForTimeout(500);
 await pg.evaluate(()=>{$('#dlg').close();
  const d=LIB[LIB.length-1];const ty={id:uid(),name:'Parede do componente',layers:[{mat:'comp:'+d.id,t:1}]};
  P.types.wall.push(ty);DEF.wall.ty=ty.id;
  P.els=[];const w=mk(P,'wall',{x1:.5,z1:.5,x2:12.5,z2:.5,ty:ty.id,h:5,off:0},lv);P.els.push(w);
  B=build(P);tool='sel';sel=w.id;SELS=[w.id];fit();cam.s=34;render()});
 await pg.waitForTimeout(400);
 console.log('parede visível na planta:',await pg.evaluate(()=>B.per[sel])+' blocos |',
   await pg.evaluate(()=>{const t=B.tile[sel];return t.n+' cópias de '+t.dim+(t.rot?' giradas '+t.rot+'°':'')+', sobra '+t.left}));
 console.log('malhas no 3D:',await pg.evaluate(()=>{setView('3d');return meshes.reduce((a,m)=>a+m.count,0)+' blocos instanciados'}));
 await pg.evaluate(()=>setView('plan'));await pg.waitForTimeout(400);
 await (await pg.$('#c2')).screenshot({path:'/tmp/sL.png'});
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
