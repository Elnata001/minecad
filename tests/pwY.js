const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1300,height:900},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message+' @ '+String(e.stack||'').split('\n')[1]));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 await pg.evaluate(()=>{openP(newProject());P.els=[];
  const mkd=(n,cat,cells)=>{LIB.push({id:uid(),name:n,cat,n:cells.length,cells})};
  const w=[];for(let x=0;x<4;x++)for(let y=0;y<3;y++)w.push({x,y,z:0,m:x===0?'stone_bricks':'cobblestone'});
  mkd('Parede modular','Paredes',w);
  mkd('Pilar duplo','Pilares',[0,1].map(y=>({x:0,y,z:0,m:'stone_bricks'})));
  libSave();B=build(P);render()});
 // 2) grupo de ferramentas
 const grp=await pg.evaluate(()=>{const g=[...document.querySelectorAll('#tools .tl[data-g]')].filter(b=>b.dataset.g).map(b=>({main:(b.dataset.lab||b.title),subs:(SUBT[b.dataset.g]||[]).map(x=>x[1])}));
  return g.filter(x=>x.subs.length)});
 console.log('2/3. grupos:');grp.forEach(g=>console.log('   ',g.main,'->',g.subs.join(' | ')));
 console.log('   Parede-cortina fora do grupo?',await pg.evaluate(()=>[...document.querySelectorAll('#tools .tl')].some(b2=>(b2.dataset.lab||b2.title)==='Parede-cortina')));
 // hover revela
 const wall=await pg.$('#tools .tl[data-a="tool:wall"]');
 console.log('   antes do hover, camada aberta:',await pg.evaluate(()=>{const o=document.querySelector('#tgrp');return !!o&&o.classList.contains('on')}));
 await wall.hover();await pg.waitForTimeout(350);
 console.log('   com o cursor na parede:',await pg.evaluate(()=>{const o=document.querySelector('#tgrp');return o&&o.classList.contains('on')?[...o.querySelectorAll('.tl')].map(b=>(b.dataset.lab||b.title)).join(' | '):'camada fechada'}));
 await pg.screenshot({path:'/tmp/sT.png'});
 // 3) parede personalizada
 await (await pg.$('#tools .tl[data-a="tool:wall"]')).hover();await pg.waitForTimeout(300);
 {const q=await (await pg.$('#tgrp [data-a="tool:wallc"]')).boundingBox();
  await pg.mouse.move(q.x+q.width/2,q.y+q.height/2);await pg.waitForTimeout(120);await pg.mouse.down();await pg.mouse.up()}
 await pg.waitForTimeout(350);
 console.log('   ferramenta:',await pg.evaluate(()=>tool+' / modo '+(CMODE||'normal')),'| tipo:',await pg.evaluate(()=>(typeOf(P,DEF.wall.ty)||{}).name));
 console.log('   painel:',(await pg.textContent('#pp')).replace(/\s+/g,' ').slice(0,120));
 const bb=await (await pg.$('#c2')).boundingBox();
 await pg.mouse.click(bb.x+bb.width/2-150,bb.y+bb.height/2);await pg.waitForTimeout(150);
 await pg.mouse.click(bb.x+bb.width/2+150,bb.y+bb.height/2);await pg.keyboard.press('Escape');await pg.waitForTimeout(300);
 console.log('   parede criada:',await pg.evaluate(()=>{const w=P.els.find(e=>e.cat==='wall');if(!w)return'não criada';const t=B.tile[w.id];return t?t.n+' módulo(s) de '+t.name:'SEM COMPONENTE'}));
 // ferramenta parede normal volta ao material comum
 await pg.click('[data-a="tool:wall"]');await pg.waitForTimeout(250);
 console.log('   voltando à parede normal: modo',await pg.evaluate(()=>CMODE||'normal'));
 // tipos de parede não oferecem mais componentes
 console.log('   componentes na janela de tipos:',await pg.evaluate(()=>matOpts('wall',1).some(o=>o[0].indexOf('comp:')===0)));
 // pilar personalizado
 await (await pg.$('#tools .tl[data-a="tool:column"]')).hover();await pg.waitForTimeout(300);
 {const q=await (await pg.$('#tgrp [data-a="tool:columnc"]')).boundingBox();
  await pg.mouse.move(q.x+q.width/2,q.y+q.height/2);await pg.waitForTimeout(120);await pg.mouse.down();await pg.mouse.up()}
 await pg.waitForTimeout(300);
 console.log('   pilar personalizado -> material do desenho:',await pg.evaluate(()=>DEF.column.mat));
 await pg.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2-150);await pg.waitForTimeout(300);
 console.log('   pilar criado:',await pg.evaluate(()=>{const c=P.els.find(e=>e.cat==='column');if(!c)return'não criado';const t=B.tile[c.id];return t?t.n+' módulo(s) de '+t.name:'SEM COMPONENTE'}));
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
