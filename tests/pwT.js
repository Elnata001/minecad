const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1400,height:900}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message+' @ '+String(e.stack||'').split('\n')[1]));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 // ---- fluxo real pela interface ----
 await pg.evaluate(()=>{openP(newProject());P.els=[];B=build(P);render();dlgComp()});await pg.waitForTimeout(300);
 await pg.click('[data-a="cnew"]');await pg.waitForTimeout(250);
 await pg.fill('#askv','Parede de pedra');await pg.click('[data-a="askok"]');await pg.waitForTimeout(400);
 // escolhe a categoria Paredes pelo seletor real
 await pg.click('#cfb [data-ce="c"]');await pg.waitForTimeout(200);
 await pg.click('#sxp .sxi:has-text("Paredes")');await pg.waitForTimeout(250);
 console.log('categoria escolhida:',await pg.evaluate(()=>CEDIT.cat));
 // modela com a ferramenta Bloco, clicando na área
 await pg.click('[data-a="tool:block"]');await pg.waitForTimeout(200);
 const bb=await (await pg.$('#c2')).boundingBox(),S=await pg.evaluate(()=>cam.s);
 const cell=async(dx,dy)=>{await pg.mouse.click(bb.x+bb.width/2+dx*S,bb.y+bb.height/2+dy*S);await pg.waitForTimeout(90)};
 for(const [x,y] of [[0,0],[1,0],[2,0]]){await pg.evaluate(y2=>{DEF.block.off=y2;render()},0);await cell(x,0)}
 await pg.evaluate(()=>{DEF.block.off=1;render()});
 for(const [x,y] of [[0,0],[1,0],[2,0]])await cell(x,0);
 console.log('blocos modelados:',await pg.evaluate(()=>P.els.length),'| alturas:',await pg.evaluate(()=>[...new Set(P.els.map(e=>e.off))].join(',')));
 await pg.click('[data-a="cdone"]');await pg.waitForTimeout(600);
 const d=await pg.evaluate(()=>{const x=LIB[LIB.length-1];return{id:x.id,name:x.name,cat:x.cat,n:x.cells.length,cells:x.cells.map(c=>c.x+','+c.y+','+c.z).join(' ')}});
 console.log('componente salvo:',d.name,'/',d.cat,'/',d.n,'células ->',d.cells);
 // novo tipo de parede pela interface
 await pg.evaluate(()=>{$('#dlg').close();dlgTypes()});await pg.waitForTimeout(300);
 await pg.click('[data-a="tynew"]');await pg.waitForTimeout(300);
 const tid=await pg.evaluate(()=>P.types.wall[P.types.wall.length-1].id);
 // escolhe o componente no seletor de material da camada
 await pg.click(`#dlg [data-ty="${tid}"][data-f="mat"]`);await pg.waitForTimeout(250);
 const opt=await pg.$(`#sxp .sxi:has-text("componente")`);
 console.log('opção de componente na lista:',!!opt);
 if(opt){await opt.click();await pg.waitForTimeout(350)}
 console.log('tipo depois:',await pg.evaluate(t=>{const ty=P.types.wall.find(x=>x.id===t);return JSON.stringify(ty.layers)},tid));
 // desenha a parede com esse tipo
 await pg.evaluate(t=>{$('#dlg').close();DEF.wall.ty=t;tool='wall';pts=null;render()},tid);
 await pg.waitForTimeout(200);
 await cell(-4,3);await cell(6,3);await pg.keyboard.press('Escape');await pg.waitForTimeout(300);
 const r=await pg.evaluate(()=>{const w=P.els.find(e=>e.cat==='wall');if(!w)return{erro:'sem parede'};
  const t=B.tile[w.id];return{ty:w.ty,tipo:JSON.stringify((P.types.wall.find(x=>x.id===w.ty)||{}).layers),h:w.h,
   comp:compOfEl(P,w),cells:[...B.vox.values()].filter(v=>v.o===w.id).length,tile:t?JSON.stringify(t):'(sem tile)'}});
 console.log('parede desenhada:',JSON.stringify(r,null,1).replace(/\n\s*/g,' '));
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
