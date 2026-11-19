const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1360,height:880},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 await pg.evaluate(()=>{openP(newProject());P.els=[];
  const w=[];for(let x=0;x<4;x++)for(let y=0;y<3;y++)w.push({x,y,z:0,m:'stone_bricks'});
  LIB.push({id:uid(),name:'Parede modular',cat:'Paredes',n:w.length,cells:w});libSave();B=build(P);render()});
 // 1. rótulo sempre depois do último botão
 const lab=async sel=>{const el=await pg.$(sel);await el.hover();await pg.waitForTimeout(350);
  return pg.evaluate(()=>{const l=document.querySelector('#tlab'),o=document.querySelector('#tgrp');
   if(!l||!l.classList.contains('on'))return'sem rótulo';const r=l.getBoundingClientRect(),q=o.getBoundingClientRect();
   return '"'+l.textContent+'" começa em '+Math.round(r.left)+' · grupo termina em '+Math.round(q.right)+' · sobrepõe? '+(r.left<q.right)})};
 await (await pg.$('#tools .tl[data-a="tool:wall"]')).hover();await pg.waitForTimeout(400);
 console.log('1. principal:',await lab('#tools .tl[data-a="tool:wall"]'));
 console.log('   1º do grupo:',await lab('#tgrp .tl[data-a="tool:curtain"]'));
 console.log('   2º do grupo:',await lab('#tgrp .tl[data-a="tool:wallc"]'));
 console.log('   tooltip nativo:',await pg.evaluate(()=>{const t=document.querySelector('#tools .tl[data-a="tool:wall"]');return'title="'+(t.getAttribute('title')||'')+'" aria-label="'+t.getAttribute('aria-label')+'"'}));
 await pg.screenshot({path:'/tmp/fx_lab.png',clip:{x:0,y:80,width:460,height:330}});
 // 2. roda do mouse sobre os botões
 await pg.mouse.move(600,600);await pg.waitForTimeout(200);
 const bb=await (await pg.$('#tools .tl[data-a="tool:wall"]')).boundingBox();
 await pg.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await pg.mouse.wheel(0,220);await pg.waitForTimeout(250);
 console.log('2. roda sobre o botão -> scrollTop',await pg.evaluate(()=>$('#tools').scrollTop),'| sobra do painel',await pg.evaluate(()=>{const t=$('#tools'),b2=t.querySelector('.tl');return Math.round(t.getBoundingClientRect().right-b2.getBoundingClientRect().right)+'px'}));
 await pg.evaluate(()=>$('#tools').scrollTop=0);await pg.waitForTimeout(150);
 // 3. lista não fecha ao rolar
 await pg.evaluate(()=>{dlgMats();mtAct('mtnew','')});await pg.waitForTimeout(350);
 await pg.evaluate(()=>{const s=document.querySelector('#dlg .sxd[data-f="block"]');s&&s.click()});await pg.waitForTimeout(450);
 const lb=await (await pg.$('#sxp .sxl')).boundingBox();
 await pg.mouse.move(lb.x+lb.width/2,lb.y+lb.height/2);await pg.mouse.wheel(0,260);await pg.waitForTimeout(350);
 console.log('3. após rolar a lista: aberta',await pg.evaluate(()=>!!document.querySelector('#sxp.open')),'| scrollTop',await pg.evaluate(()=>{const l=document.querySelector('#sxp .sxl');return l?Math.round(l.scrollTop):-1}));
 await pg.keyboard.press('Escape');await pg.evaluate(()=>$('#dlg').close());await pg.waitForTimeout(250);
 // 4. campo "Estender espessura nas pontas"
 const campos=async()=>pg.evaluate(()=>[...document.querySelectorAll('#pp label')].map(l=>l.textContent.trim().split('\n')[0]).join(' | '));
 await pg.click('#tools .tl[data-a="tool:wall"]');await pg.waitForTimeout(300);
 console.log('4. parede normal:',await campos());
 await (await pg.$('#tools .tl[data-a="tool:wall"]')).hover();await pg.waitForTimeout(350);
 {const q=await (await pg.$('#tgrp [data-a="tool:wallc"]')).boundingBox();
  await pg.mouse.move(q.x+q.width/2,q.y+q.height/2);await pg.waitForTimeout(120);await pg.mouse.down();await pg.mouse.up()}
 await pg.waitForTimeout(400);
 console.log('   parede personalizada:',await campos());
 console.log(errs.join('\n')||' sem erros');await b.close()})();
