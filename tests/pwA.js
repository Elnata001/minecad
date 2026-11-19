const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message+' @ '+String(e.stack||'').split('\n')[1]));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 await pg.evaluate(()=>{openP(newProject());P.els=[];
  const w=mk(P,'wall',{x1:.5,z1:2.5,x2:9.5,z2:2.5,t:1,h:4},lv);P.els.push(w);B=build(P);
  o.t.set(5,2,2);o.r=30;o.th=.9;o.ph=1;setView('3d')});
 const bb=await (await pg.$('#v3')).boundingBox(),CX=bb.x+bb.width/2,CY=bb.y+bb.height/2;
 const cam=()=>pg.evaluate(()=>[+o.th.toFixed(3),+o.ph.toFixed(3),+o.r.toFixed(2),[+o.t.x.toFixed(2),+o.t.y.toFixed(2),+o.t.z.toFixed(2)].join(',')]);
 const drag=async(btn,dx,dy,mod)=>{await pg.mouse.move(CX,CY);if(mod)await pg.keyboard.down(mod);
  await pg.mouse.down({button:btn});await pg.mouse.move(CX+dx,CY+dy,{steps:5});await pg.mouse.up({button:btn});
  if(mod)await pg.keyboard.up(mod);await pg.waitForTimeout(120)};
 let a=await cam();
 await drag('middle',100,0);let c=await cam();
 console.log('meio, arrastar 100px para a direita -> th',a[0],'→',c[0],c[0]>a[0]?'(cena segue o cursor ✓)':'(invertido ✗)');
 a=c;await drag('middle',0,80);c=await cam();
 console.log('meio, arrastar para baixo       -> ph',a[1],'→',c[1]);
 a=c;await drag('middle',60,40,'Shift');c=await cam();
 console.log('Shift+meio (deslocar)           -> alvo',a[3],'→',c[3],a[3]!==c[3]?'✓':'✗');
 a=c;await drag('middle',0,-60,'Control');c=await cam();
 console.log('Ctrl+meio, cursor para cima     -> distância',a[2],'→',c[2],c[2]<a[2]?'(aproximou ✓)':'(afastou ✗)');
 a=c;await pg.mouse.move(CX,CY);await pg.mouse.wheel(0,-120);await pg.waitForTimeout(150);c=await cam();
 console.log('roda para cima                  -> distância',a[2],'→',c[2],c[2]<a[2]?'✓':'✗');
 // botão esquerdo com ferramenta ativa não orbita
 await pg.click('[data-a="tool:block"]');a=await cam();await drag('left',90,30);c=await cam();
 console.log('esquerdo com a ferramenta Bloco -> th',a[0],'→',c[0],a[0]===c[0]?'(não orbita ✓)':'(orbitou ✗)');
 await pg.click('[data-a="tool:sel"]');
 // menu de contexto no 3D
 await pg.evaluate(()=>{window.__HIT3=[{point:{x:5,y:1,z:2.5},instanceId:0,object:{userData:{o:[P.els[0].id]}}}]});
 await pg.mouse.click(CX,CY,{button:'right'});await pg.waitForTimeout(250);
 console.log('menu no 3D:',await pg.evaluate(()=>{const m=document.querySelector('#cmx');return m?[...m.querySelectorAll('[data-cm]')].map(i=>i.textContent).join(' | '):'NÃO ABRIU'}));
 await pg.click('[data-cm="hide"]');await pg.waitForTimeout(250);
 console.log('oculto no 3D:',await pg.evaluate(()=>((P.hid||{})['3d']||[]).length+' | malhas no 3D: '+meshes.length));
 console.log('na planta continua visível:',await pg.evaluate(()=>((P.hid||{})['p:'+lv]||[]).length===0?'sim ✓':'não ✗'));
 // esquemas de navegação
 await pg.evaluate(()=>{NAVP='blender';render()});
 a=await cam();await drag('right',80,0);c=await cam();
 console.log('Blender, botão direito          -> alvo',a[3],'→',c[3],a[3]===c[3]?'(não desloca ✓)':'(deslocou ✗)');
 await pg.evaluate(()=>{NAVP='cad';render()});
 a=await cam();await drag('middle',80,0);c=await cam();
 console.log('Revit/CAD, botão do meio        -> alvo',a[3],'→',c[3],a[3]!==c[3]?'(desloca ✓)':'(✗)');
 await pg.evaluate(()=>{NAVP='std';NAVI=true});
 a=await cam();await drag('middle',100,0);c=await cam();
 console.log('mouse invertido                 -> th',a[0],'→',c[0],c[0]<a[0]?'✓':'✗');
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
