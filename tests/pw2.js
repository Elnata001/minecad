const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1440,height:900}});
 const errs=[];pg.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(1200);
 await pg.evaluate(()=>{openP(newProject());fit();render()});await pg.waitForTimeout(300);
 const bb=await (await pg.$('#c2')).boundingBox(),C=(dx,dy)=>[bb.x+bb.width/2+dx,bb.y+bb.height/2+dy];
 const click=async(dx,dy)=>{await pg.mouse.click(...C(dx,dy));await pg.waitForTimeout(120)};
 // parede em dois cliques (refatoração do toolClick)
 await pg.click('[data-a="tool:wall"]');await click(-200,-150);await click(100,-150);await pg.keyboard.press('Escape');
 // piso
 await pg.click('[data-a="tool:floor"]');await click(-200,-150);await click(100,100);
 // blocos avulsos: material laje + altura 3
 await pg.click('[data-a="tool:block"]');
 await pg.evaluate(()=>{DEF.block.mat='oak_stairs';DEF.block.off=3;DEF.block.fc='north';render()});
 await click(-60,0);await click(0,0);
 await pg.keyboard.press(' ');// gira a prévia
 await click(60,0);
 const r=await pg.evaluate(()=>({els:P.els.map(e=>e.cat+'/'+(e.mat||'')+'/off'+(e.off===undefined?'-':e.off)+(e.fc?'/'+e.fc:'')),blocos:B.qty,draft:DEF.block.fc}));
 console.log('elementos:',r.els.join('\n           '));
 console.log('quantitativo:',JSON.stringify(r.blocos),'| direção do desenho após Espaço:',r.draft);
 // seleciona um bloco e usa PgUp
 await pg.click('[data-a="tool:sel"]');
 await pg.evaluate(()=>{const b2=P.els.filter(e=>e.cat==='block')[0];sel=b2.id;SELS=[b2.id];render()});
 await pg.keyboard.press('PageUp');await pg.keyboard.press('PageUp');await pg.waitForTimeout(200);
 console.log('após PgUp×2, altura do bloco:',await pg.evaluate(()=>P.els.filter(e=>e.cat==='block')[0].off));
 await pg.keyboard.press(' ');await pg.waitForTimeout(150);
 console.log('após Espaço, direção:',await pg.evaluate(()=>P.els.filter(e=>e.cat==='block')[0].fc));
 console.log('painel do bloco:',(await pg.textContent('#props')).replace(/\s+/g,' ').slice(0,260));
 await pg.keyboard.press('Control+z');await pg.waitForTimeout(150);
 console.log('desfazer -> direção:',await pg.evaluate(()=>P.els.filter(e=>e.cat==='block')[0].fc));
 // faixa de vista: bloco em Y5 some da planta e volta
 await pg.evaluate(()=>{fit();render()});
 await pg.screenshot({path:'/tmp/s4.png'});
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
