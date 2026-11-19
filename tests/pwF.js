const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1400,height:900}});
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 const nav=()=>pg.evaluate(()=>{const b2=[...document.querySelectorAll('#nav .it')].find(x=>x.className.includes('on'));return b2?b2.textContent:'(nenhum)'});
 const props=()=>pg.evaluate(()=>document.querySelector('#props').textContent.replace(/\s+/g,' ').slice(0,45));
 console.log('nível ativo (nav):',await nav(),'| lv interno:',await pg.evaluate(()=>lvl().name));
 // clica na segunda planta do navegador
 const b2=await pg.$$('#nav .it');
 await b2[1].click();await pg.waitForTimeout(300);
 console.log('após clicar na 2ª planta -> nav:',await nav(),'| lv interno:',await pg.evaluate(()=>lvl().name));
 console.log('   activeElement:',await pg.evaluate(()=>document.activeElement.tagName+'/'+(document.activeElement.textContent||'').slice(0,18)));
 // agora clica no canvas e vê se destrava
 const bb=await (await pg.$('#c2')).boundingBox();
 await pg.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);await pg.waitForTimeout(250);
 console.log('   depois de clicar no canvas -> nav:',await nav());
 // props ao entrar no modo componente
 console.log('props antes:',await props());
 await pg.evaluate(()=>dlgComp());await pg.waitForTimeout(250);
 await pg.click('[data-a="cnew"]');await pg.waitForTimeout(250);
 await pg.click('[data-a="askok"]');await pg.waitForTimeout(400);
 console.log('props depois de Novo componente:',await props());
 console.log('   CEDIT:',await pg.evaluate(()=>!!CEDIT),'| tool:',await pg.evaluate(()=>tool));
 await b.close()})();
