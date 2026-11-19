const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1440,height:900}});
 const errs=[];pg.on('pageerror',e=>errs.push('PAGEERROR '+e.message+' @ '+String(e.stack||'').split('\n')[1]));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 await pg.evaluate(()=>{openP(newProject());P.els=[];B=build(P);o.t.set(8,0,8);o.r=30;o.th=.9;o.ph=1;setView('3d')});
 const bb=await (await pg.$('#v3')).boundingBox(),CX=bb.x+bb.width/2,CY=bb.y+bb.height/2;
 const face=(x,y,z,id)=>pg.evaluate(([x,y,z,id])=>{window.__HIT3=[{point:{x,y,z},instanceId:0,object:{userData:{o:[id]}}}]},[x,y,z,id]);
 const clear=()=>pg.evaluate(()=>{window.__HIT3=null});
 // 1) bloco no plano
 await pg.click('[data-a="tool:block"]');await pg.evaluate(()=>{DEF.block.mat='stone';DEF.block.off=0;render()});
 await pg.mouse.click(CX,CY);await pg.waitForTimeout(200);
 const id0=await pg.evaluate(()=>P.els[0].id);
 // 2) empilhar: clique na face de topo do bloco criado
 await face(8.5,1,8.5,id0);
 await pg.mouse.move(CX,CY);await pg.waitForTimeout(150);
 console.log('fantasma sobre a face:',await pg.evaluate(()=>[GH.position.x,GH.position.y,GH.position.z].join(',')));
 await pg.mouse.click(CX,CY);await pg.waitForTimeout(250);
 console.log('empilhou:',await pg.evaluate(()=>P.els.map(e=>'Y'+e.off).join(',')),'| altura do desenho agora:',await pg.evaluate(()=>DEF.block.off));
 await clear();
 // 3) parede no 3D e porta clicando na face da parede
 await pg.click('[data-a="tool:wall"]');await pg.evaluate(()=>{DEF.wall.off=0;render()});
 await pg.mouse.click(CX-150,CY+60);await pg.waitForTimeout(150);
 await pg.mouse.click(CX+150,CY+60);await pg.waitForTimeout(200);await pg.keyboard.press('Escape');
 const wid=await pg.evaluate(()=>P.els.find(e=>e.cat==='wall').id);
 const wp=await pg.evaluate(()=>{const w=P.els.find(e=>e.cat==='wall');return[w.x1,w.z1,w.x2,w.z2]});
 await pg.click('[data-a="tool:door"]');
 await face(wp[0]+1,0.5,wp[1],wid);
 await pg.mouse.click(CX,CY);await pg.waitForTimeout(250);
 console.log('porta:',await pg.evaluate(()=>{const d=P.els.find(e=>e.cat==='door');return d?'hospedada em '+(P.els.find(e=>e.id===d.host)||{}).name+' pos '+d.pos:'NÃO CRIADA'}));
 await clear();
 // 4) mover por arraste no 3D (elemento selecionado)
 await pg.click('[data-a="tool:sel"]');
 await pg.evaluate(([id])=>{sel=id;SELS=[id];render()},[wid]);
 const before=await pg.evaluate(()=>{const w=P.els.find(e=>e.cat==='wall');return[w.x1,w.z1]});
 await face(before[0],0.5,before[1],wid);
 await pg.mouse.move(CX-150,CY+60);await pg.mouse.down();await clear();
 await pg.mouse.move(CX-120,CY+70,{steps:6});await pg.mouse.move(CX-90,CY+80,{steps:6});await pg.mouse.up();
 await pg.waitForTimeout(250);
 const after=await pg.evaluate(()=>{const w=P.els.find(e=>e.cat==='wall');return[w.x1,w.z1]});
 console.log('arrastar no 3D: de',before.join(','),'para',after.join(','),'| desfazer disponível:',await pg.evaluate(()=>H.length>0));
 await pg.keyboard.press('Control+z');await pg.waitForTimeout(200);
 console.log('após desfazer:',await pg.evaluate(()=>{const w=P.els.find(e=>e.cat==='wall');return[w.x1,w.z1].join(',')}));
 // 5) Alt + arraste = altura
 await pg.evaluate(([id])=>{sel=id;SELS=[id];render()},[wid]);
 await face(before[0],0.5,before[1],wid);
 await pg.mouse.move(CX-150,CY+60);await pg.mouse.down();await clear();
 await pg.keyboard.down('Alt');await pg.mouse.move(CX-150,CY-20,{steps:8});await pg.mouse.up();await pg.keyboard.up('Alt');
 await pg.waitForTimeout(250);
 console.log('Alt+arraste -> deslocamento da parede:',await pg.evaluate(()=>P.els.find(e=>e.cat==='wall').off));
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
