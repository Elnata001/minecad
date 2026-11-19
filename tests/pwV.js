const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1200,height:800},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message+' @ '+String(e.stack||'').split('\n')[1]));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 // o programa abre na tela inicial: sai dela como o usuário sairia
 await pg.evaluate(()=>welClose());
 // eixos no modo de criação
 await pg.evaluate(()=>{cEnter('Parede com pilar',null);CEDIT.cat='Paredes';
  for(let x=0;x<6;x++)for(let y=0;y<4;y++)P.els.push(mk(P,'block',{x1:x+.5,z1:.5,off:y,mat:'cobblestone'},lv));
  for(let y=0;y<4;y++)P.els.push(mk(P,'block',{x1:.5,z1:1.5,off:y,mat:'stone_bricks'},lv));
  B=build(P);fit();cam.s=36;cam.x=3;cam.z=1;render()});
 await pg.waitForTimeout(400);
 await (await pg.$('#c2')).screenshot({path:'/tmp/sP.png'});
 console.log('1. eixos desenhados na planta (verde no 0,0): ver captura');
 await pg.click('[data-a="cdone"]');await pg.waitForTimeout(500);
 const d=await pg.evaluate(()=>{const x=LIB[LIB.length-1];return{id:x.id,dim:cDim(x)}});
 console.log('2. componente:',d.dim,'(comp.×alt.×esp.)');
 // parede de 9 com módulo de 6 de comprimento
 await pg.evaluate(c=>{$('#dlg').close();openP(newProject());P.els=[];
  const ty={id:uid(),name:'Modular',layers:[{mat:'comp:'+c,t:1}]};P.types.wall.push(ty);
  const w=mk(P,'wall',{x1:.5,z1:.5,x2:9.5,z2:.5,ty:ty.id,h:4,off:0},lv);P.els.push(w);B=build(P);sel=w.id;SELS=[w.id];tool='sel';render()},d.id);
 await pg.waitForTimeout(300);
 console.log('3. parede de 10 ->',await pg.evaluate(()=>{const t=B.tile[sel];return t.n+' módulo(s) de '+t.dim+', '+B.per[sel]+' blocos'}));
 console.log('   células em Z (espessura):',await pg.evaluate(()=>[...new Set([...B.vox.values()].map(v=>v.z))].sort((a,b)=>a-b).join(',')));
 // componente modelado de través + botão girar
 await pg.evaluate(()=>{const d2={id:uid(),name:'De través',cat:'Paredes',n:12,cells:[]};
  for(let z=0;z<6;z++)for(let y=0;y<2;y++)d2.cells.push({x:0,y,z,m:'stone_bricks'});
  LIB.push(d2);libSave();window.__dt=d2.id;
  P.els=[];const ty=P.types.wall[P.types.wall.length-1];ty.layers=[{mat:'comp:'+d2.id,t:1}];
  const w=mk(P,'wall',{x1:.5,z1:.5,x2:11.5,z2:.5,ty:ty.id,h:4,off:0},lv);P.els.push(w);B=build(P);sel=w.id;SELS=[w.id];render()});
 await pg.waitForTimeout(250);
 console.log('4. componente de través ->',await pg.evaluate(()=>{const t=B.tile[sel];return t.n+' módulo(s), espessura em Z: '+[...new Set([...B.vox.values()].map(v=>v.z))].length}));
 await pg.evaluate(()=>{dlgComp()});await pg.waitForTimeout(300);
 await pg.click(`[data-a="crot:${await pg.evaluate(()=>window.__dt)}"]`);await pg.waitForTimeout(400);
 console.log('   após girar na biblioteca ->',await pg.evaluate(()=>{const t=B.tile[sel];return t.n+' módulo(s), espessura em Z: '+[...new Set([...B.vox.values()].map(v=>v.z))].length+', dim '+t.dim}));
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
