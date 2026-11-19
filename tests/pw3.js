const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1440,height:900}});
 const errs=[];pg.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 console.log('THREE (shim):',await pg.evaluate(()=>!!window.THREE&&!!R));
 await pg.evaluate(()=>{openP(newProject());P.els=[];B=build(P);
  o.t.set(8,0,8);o.r=30;o.th=.9;o.ph=1; /* vista 3/4 padrão */
  setView('3d')});
 await pg.waitForTimeout(300);
 const bb=await (await pg.$('#v3')).boundingBox(),CX=bb.x+bb.width/2,CY=bb.y+bb.height/2;
 // ferramenta Bloco, altura 0: clique no centro da tela = plano de trabalho Y0
 await pg.click('[data-a="tool:block"]');
 await pg.evaluate(()=>{DEF.block.mat='stone';DEF.block.off=0;render()});
 await pg.mouse.move(CX,CY);await pg.waitForTimeout(150);
 console.log('fantasma visível:',await pg.evaluate(()=>GH&&GH.visible),'| posição',await pg.evaluate(()=>GH?[GH.position.x,GH.position.y,GH.position.z].join(','):'-'));
 console.log('barra de status:',await pg.textContent('#st'));
 await pg.mouse.click(CX,CY);await pg.waitForTimeout(250);
 console.log('após o clique:',await pg.evaluate(()=>P.els.map(e=>e.cat+' off'+e.off+' em X'+Math.floor(e.x1)+' Z'+Math.floor(e.z1)).join(' | ')));
 // altura 4: o plano de trabalho sobe
 await pg.evaluate(()=>{DEF.block.off=4;render()});
 await pg.mouse.move(CX+40,CY+10);await pg.waitForTimeout(150);await pg.mouse.click(CX+40,CY+10);await pg.waitForTimeout(250);
 console.log('com altura 4:',await pg.evaluate(()=>P.els.map(e=>'Y'+e.off).join(',')),'| células',await pg.evaluate(()=>[...B.vox.values()].map(v=>v.x+','+v.y+','+v.z).join(' | ')));
 // parede em dois cliques no 3D
 await pg.click('[data-a="tool:wall"]');
 await pg.evaluate(()=>{DEF.wall.off=0;render()});
 await pg.mouse.click(CX-120,CY+40);await pg.waitForTimeout(200);
 console.log('linha-guia após o 1º ponto:',await pg.evaluate(()=>GL&&GL.visible));
 await pg.mouse.move(CX+120,CY+40);await pg.waitForTimeout(150);
 await pg.mouse.click(CX+120,CY+40);await pg.waitForTimeout(250);
 await pg.keyboard.press('Escape');
 console.log('parede criada:',await pg.evaluate(()=>P.els.filter(e=>e.cat==='wall').map(e=>`de ${Math.floor(e.x1)},${Math.floor(e.z1)} a ${Math.floor(e.x2)},${Math.floor(e.z2)} off ${e.off}`).join(' | ')));
 // seleção e alças no 3D
 await pg.click('[data-a="tool:sel"]');
 await pg.evaluate(()=>{const w=P.els.find(e=>e.cat==='wall');sel=w.id;SELS=[w.id];render()});
 console.log('alças no 3D:',await pg.evaluate(()=>HM.length));
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
