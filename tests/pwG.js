const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:620},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.addInitScript(()=>{window.prompt=()=>null;window.confirm=()=>false;window.alert=()=>{}});
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 // 1) biblioteca numa janela baixa: o botão Fechar está visível sem rolar?
 await pg.evaluate(()=>dlgComp());await pg.waitForTimeout(400);
 const fe=await pg.$('[data-a="close"]');
 console.log('1. Fechar visível sem rolar:',await fe.isVisible()&&await pg.evaluate(()=>{const b2=document.querySelector('[data-a="close"]').getBoundingClientRect();return b2.top>=0&&b2.bottom<=innerHeight})?'sim':'NÃO');
 console.log('   diálogo rola por fora?',await pg.evaluate(()=>{const d=document.querySelector('#dlg');return d.scrollHeight>d.clientHeight+2?'SIM (ruim)':'não'}));
 await pg.screenshot({path:'/tmp/sF.png'});
 // 2) barra de propriedades do componente
 const cad=await pg.evaluate(()=>LIB.find(d=>d.name==='Cadeira').id);
 await pg.click(`[data-a="cuse:${cad}"]`);await pg.waitForTimeout(300);
 const h=await pg.evaluate(()=>{const p=document.querySelector('#pp');return{altura:Math.round(p.getBoundingClientRect().height),mini:!!p.querySelector('canvas')}});
 await pg.evaluate(()=>{tool='wall';render()});await pg.waitForTimeout(200);
 const h2=await pg.evaluate(()=>Math.round(document.querySelector('#pp').getBoundingClientRect().height));
 console.log('2. altura da barra: componente',h.altura,'| parede',h2,'| miniatura no painel:',h.mini?'AINDA EXISTE':'removida');
 // 3) barra de criação flutuante
 await pg.evaluate(()=>cEnter('Teste',null));await pg.waitForTimeout(400);
 const cf=await pg.evaluate(()=>{const c=document.querySelector('#cfb'),r=c.getBoundingClientRect(),p=document.querySelector('#pp').getBoundingClientRect();
  return{visivel:getComputedStyle(c).display,itens:[...c.children].map(x=>x.tagName+':'+(x.textContent||x.tagName).slice(0,12)).join(' '),centralizada:Math.abs((r.left+r.right)/2-innerWidth/2)<60,abaixoDasProps:r.top>=p.bottom-2,altura:Math.round(r.height),props:Math.round(p.height)}});
 console.log('3. barra flutuante:',cf.visivel,'| centralizada:',cf.centralizada,'| abaixo da barra de propriedades:',cf.abaixoDasProps,'| altura',cf.altura);
 console.log('   itens lado a lado:',cf.itens);
 console.log('   altura da barra de propriedades no modo criação:',cf.props,'(parede:',h2+')');
 await pg.screenshot({path:'/tmp/sG.png'});
 // digitar no nome não é interrompido pelo render
 await pg.click('#cfb input[data-ce="n"]');await pg.keyboard.type(' do jardim');await pg.waitForTimeout(200);
 await pg.evaluate(()=>render());await pg.waitForTimeout(150);
 console.log('   nome digitado:',await pg.inputValue('#cfb input[data-ce="n"]'),'| CEDIT:',await pg.evaluate(()=>CEDIT.name));
 await pg.click('[data-a="ccancel"]');await pg.waitForTimeout(200);await pg.click('[data-a="askok"]');await pg.waitForTimeout(300);
 console.log('   após cancelar, barra escondida:',await pg.evaluate(()=>getComputedStyle(document.querySelector('#cfb')).display));
 // 4) navegador atualiza no clique
 const nav=()=>pg.evaluate(()=>{const b2=[...document.querySelectorAll('#nav .it')].find(x=>x.className.includes('on'));return b2?b2.textContent.trim():'(nenhum)'});
 const bs=await pg.$$('#nav .it');
 await bs[1].click();await pg.waitForTimeout(250);
 console.log('4. clicar na 2ª planta -> destaque:',await nav(),'| lv:',await pg.evaluate(()=>lvl().name));
 const bs2=await pg.$$('#nav .it');await bs2[0].click();await pg.waitForTimeout(250);
 console.log('   voltar à 1ª       -> destaque:',await nav());
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
