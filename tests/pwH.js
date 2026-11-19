const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1300,height:800}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 // o programa abre na tela inicial: sai dela como o usuário sairia
 await pg.evaluate(()=>welClose());
 const nav=()=>pg.evaluate(()=>{const x=[...document.querySelectorAll('#nav .it')].find(y=>y.className.includes('on'));return x?x.textContent.trim():'-'});
 const bar=()=>pg.evaluate(()=>document.querySelector('#pp .pph').textContent.trim());
 // abre e fecha um menu suspenso (o popup fica no DOM depois disso)
 await pg.click('#qt .sxd');await pg.waitForTimeout(250);
 await pg.keyboard.press('Escape');await pg.click('body',{position:{x:5,y:400}});await pg.waitForTimeout(250);
 console.log('popup no DOM:',await pg.evaluate(()=>!!document.querySelector('#sxp')),'| aberto:',await pg.evaluate(()=>!!document.querySelector('#sxp.open')));
 // navegador e barra continuam atualizando?
 const bs=await pg.$$('#nav .it');await bs[1].click();await pg.waitForTimeout(250);
 console.log('destaque após o uso do menu:',await nav());
 await pg.click('[data-a="tool:wall"]');await pg.waitForTimeout(250);
 console.log('barra de propriedades:',await bar());
 await pg.click('[data-a="tool:block"]');await pg.waitForTimeout(250);
 console.log('troca de ferramenta:',await bar());
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
