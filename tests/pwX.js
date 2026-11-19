const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1300,height:850},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 // o programa abre na tela inicial: sai dela como o usuário sairia
 await pg.evaluate(()=>welClose());
 // 1) espaçamento do cabeçalho
 console.log('1. espaço entre os menus:',await pg.evaluate(()=>{const b2=[...document.querySelectorAll('#menus button')];
  return b2.length>1?Math.round(b2[1].getBoundingClientRect().left-b2[0].getBoundingClientRect().right)+'px':'?'}));
 // 5) botão de fechar
 await pg.evaluate(()=>dlgTypes());await pg.waitForTimeout(300);
 console.log('5. X no canto:',await pg.evaluate(()=>{const x=document.querySelector('#dlg .dlgx');if(!x)return'NÃO EXISTE';
  const r=x.getBoundingClientRect(),d=document.querySelector('#dlg').getBoundingClientRect();
  return'sim, a '+Math.round(d.right-r.right)+'px da direita e '+Math.round(r.top-d.top)+'px do topo'}),
  '| botões "Fechar" antigos escondidos:',await pg.evaluate(()=>[...document.querySelectorAll('#dlg [data-a="close"]:not(.dlgx)')].every(b2=>getComputedStyle(b2).display==='none')));
 await pg.click('#dlg .dlgx');await pg.waitForTimeout(200);
 console.log('   fecha ao clicar:',await pg.evaluate(()=>!document.querySelector('#dlg').open));
 // 4) ícones e busca
 await pg.click('[data-a="tool:floor"]');await pg.waitForTimeout(300);
 const sd=await pg.$('#pp .sxd');await sd.click();await pg.waitForTimeout(400);
 const r=await pg.evaluate(()=>{const p=document.querySelector('#sxp');
  return{itens:p.querySelectorAll('.sxi').length,icones:p.querySelectorAll('.sxi img.sxic').length,
   busca:!!p.querySelector('#sxq'),primeiro:p.querySelector('.sxi').textContent.trim()}});
 console.log('4. seletor de material:',r.itens,'itens |',r.icones,'ícones | busca:',r.busca,'| 1º:',r.primeiro);
 await pg.fill('#sxq','carvalho');await pg.waitForTimeout(300);
 console.log('   buscando "carvalho":',await pg.evaluate(()=>document.querySelectorAll('#sxp .sxi').length),'itens');
 await pg.screenshot({path:'/tmp/sR.png'});
 const first=await pg.$('#sxp .sxi');await first.click();await pg.waitForTimeout(250);
 console.log('   escolhido:',await pg.evaluate(()=>DEF.floor.mat));
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
