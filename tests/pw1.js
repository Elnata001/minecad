const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1440,height:900}});
 const errs=[];pg.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
 pg.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text().slice(0,120))});
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');
 await pg.waitForTimeout(1500);
 // o programa abre na tela inicial: sai dela como o usuário sairia
 await pg.evaluate(()=>welClose());
 console.log('THREE disponível:',await pg.evaluate(()=>!!window.THREE));
 console.log('ferramentas na barra:',await pg.evaluate(()=>[...document.querySelectorAll('#tools .tl')].map(b=>(b.dataset.lab||b.title).split(' (')[0]).join(' | ')));
 // ativa a ferramenta Bloco
 await pg.click('[data-a="tool:block"]');await pg.waitForTimeout(300);
 console.log('painel:',(await pg.textContent('#props')).slice(0,160).replace(/\s+/g,' '));
 const c=await pg.$('#c2'),bb=await c.boundingBox();
 for(const[dx,dy]of[[0,0],[40,0],[80,0],[0,40]])await pg.mouse.click(bb.x+bb.width/2+dx,bb.y+bb.height/2+dy);
 await pg.waitForTimeout(400);
 console.log('status:',await pg.textContent('#st'));
 console.log('elementos:',await pg.evaluate(()=>P.els.map(e=>e.cat+':'+e.name).join(', ')));
 await pg.screenshot({path:'/tmp/s1.png'});
 // vista 3D e tabelas
 await pg.click('[data-a="view:3d"]');await pg.waitForTimeout(600);await pg.screenshot({path:'/tmp/s2.png'});
 await pg.click('[data-a="view:table"]');await pg.waitForTimeout(600);
 console.log('tabela:',(await pg.textContent('#tbl')).replace(/\s+/g,' ').slice(0,200));
 await pg.screenshot({path:'/tmp/s3.png'});
 await pg.click('[data-a="view:plan"]');await pg.waitForTimeout(300);
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
