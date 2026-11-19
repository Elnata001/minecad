const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1360,height:880},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 await pg.evaluate(()=>{openP(newProject());P.els=[];B=build(P);render()});
 console.log('1. cabeçalho:',await pg.evaluate(()=>{const b=[...document.querySelectorAll('#menus button')];
  return b.map(x=>x.textContent).join('/')+' · folga '+Math.round(b[1].getBoundingClientRect().left-b[0].getBoundingClientRect().right)+'px'}));
 await pg.screenshot({path:'/tmp/f_hdr.png',clip:{x:0,y:0,width:560,height:48}});
 // 5 fechar padronizado
 await pg.evaluate(()=>dlgMats());await pg.waitForTimeout(500);
 console.log('5. janela Materiais:',await pg.evaluate(()=>{const x=document.querySelector('#dlg .dlgx');if(!x)return'sem botão';
  const r=x.getBoundingClientRect(),d=document.querySelector('#dlg').getBoundingClientRect();
  const old=[...document.querySelectorAll('#dlg [data-a="close"]:not(.dlgx)')].filter(e=>e.offsetParent).length;
  return 'topo '+Math.round(r.top-d.top)+'px · direita '+Math.round(d.right-r.right)+'px · botões antigos visíveis '+old}));
 await pg.screenshot({path:'/tmp/f_dlg.png'});
 await pg.evaluate(()=>$('#dlg').close());await pg.waitForTimeout(300);
 // 4 lista de blocos
 await pg.evaluate(()=>{dlgMats();mtAct('mtnew','')});await pg.waitForTimeout(400);
 await pg.evaluate(()=>{const s=document.querySelector(`#dlg .sxd[data-f="block"]`);s&&s.click()});await pg.waitForTimeout(500);
 console.log('4. lista:',await pg.evaluate(()=>{const p=document.querySelector('#sxp.open');if(!p)return'não abriu';
  return 'itens '+p.querySelectorAll('.sxi').length+' · ícones '+p.querySelectorAll('.sxi img.sxic').length+' · busca '+!!p.querySelector('#sxq')}));
 await pg.fill('#sxq','carvalho');await pg.waitForTimeout(350);
 console.log('   busca "carvalho":',await pg.evaluate(()=>[...document.querySelectorAll('#sxp .sxi span')].slice(0,6).map(s=>s.textContent).join(', ')));
 const pb=await (await pg.$('#sxp')).boundingBox();
 await pg.screenshot({path:'/tmp/f_dd.png',clip:{x:pb.x-8,y:pb.y-8,width:pb.width+16,height:Math.min(pb.height+16,420)}});
 await pg.keyboard.press('Escape');await pg.evaluate(()=>$('#dlg').close());await pg.waitForTimeout(250);
 // 2/3 grupos
 await (await pg.$('#tools .tl[data-a="tool:wall"]')).hover();await pg.waitForTimeout(450);
 console.log('2/3. grupo:',await pg.evaluate(()=>{const o=document.querySelector('#tgrp');return o&&o.classList.contains('on')?[...o.querySelectorAll('.tl')].map(b=>(b.dataset.lab||b.title)).join(' | '):'fechado'}));
 await pg.screenshot({path:'/tmp/f_grp.png',clip:{x:0,y:80,width:430,height:320}});
 console.log(errs.join('\n')||' sem erros');await b.close()})();
