/* Aviso de versão nova no aplicativo de desktop: a página pergunta o estado ao abrir, mostra o
   aviso quando a atualização está pronta, e o botão manda instalar. */
const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:700}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 /* ponte falsa do aplicativo: só o pedaço da atualização */
 await pg.addInitScript(()=>{window.__at={chamadas:[],instalou:0,estado:{estado:'ocioso',versao:null,pct:0,erro:'',versaoAtual:'27.3.1'}};
  window.mcDesktop={
   atuEstado:()=>{window.__at.chamadas.push('estado');return Promise.resolve(window.__at.estado)},
   atuProcurar:()=>{window.__at.chamadas.push('procurar');return Promise.resolve(window.__at.estado)},
   atuInstalar:()=>{window.__at.instalou++;return Promise.resolve(true)},
   ao:(c,fn)=>{(window.__at.ouvintes=window.__at.ouvintes||{})[c]=fn}}});
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 /* o aviso aparece por cima da tela inicial também: é onde quem acabou de abrir o programa está */
 console.log(await pg.evaluate(()=>{const u=$('#upd'),w=$('#wel');
  return 'tela inicial aberta: '+(w&&!w.hidden)+' · o aviso fica acima dela: '
   +(parseInt(getComputedStyle(u).zIndex||0)>parseInt(getComputedStyle(w).zIndex||0))}));

 console.log(await pg.evaluate(()=>'ao abrir: perguntou o estado '+window.__at.chamadas.includes('estado')
  +' · escuta o canal: '+!!(window.__at.ouvintes&&window.__at.ouvintes.atualizacao)
  +' · aviso ainda escondido (nada a instalar): '+$('#upd').hidden));

 console.log(await pg.evaluate(()=>{window.__at.ouvintes.atualizacao({estado:'baixando',versao:'27.4.0',pct:37,versaoAtual:'27.3.1'});
  const e=$('#upd');return 'baixando: visível='+!e.hidden+' · texto: '+(e.textContent||'').slice(0,60)}));

 console.log(await pg.evaluate(()=>{window.__at.ouvintes.atualizacao({estado:'pronta',versao:'27.4.0',pct:100,versaoAtual:'27.3.1'});
  const e=$('#upd');return 'pronta: visível='+!e.hidden
   +' · tem botão de instalar: '+!!e.querySelector('[data-a="updgo"]')
   +' · texto: '+(e.textContent||'').slice(0,46)}));

 await pg.click('#upd [data-a="updgo"]');await pg.waitForTimeout(200);
 console.log(await pg.evaluate(()=>'clique em instalar: chamou o aplicativo '+window.__at.instalou+' vez(es)'));

 console.log(await pg.evaluate(()=>{window.__at.ouvintes.atualizacao({estado:'pronta',versao:'27.4.0',pct:100});
  document.querySelector('#upd [data-a="updno"]').click();
  return 'depois de “Agora não”: aviso escondido '+$('#upd').hidden}));

 console.log(await pg.evaluate(()=>{window.__at.estado={estado:'atual',versao:null,pct:0,erro:'',versaoAtual:'27.3.1'};
  updCheck();return 'procura manual disparada; chamadas: '+window.__at.chamadas.join(', ')}));
 await pg.waitForTimeout(300);
 console.log(await pg.evaluate(()=>'sem versão nova: aviso continua escondido '+$('#upd').hidden));

 /* no navegador não há ponte: o item de menu avisa em vez de quebrar */
 const pg2=await b.newPage({viewport:{width:1100,height:700}});
 pg2.on('pageerror',e=>errs.push('ERRO(nav) '+e.message));
 await pg2.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg2.goto('file:///mnt/user-data/outputs/minecad.html');await pg2.waitForTimeout(800);
 console.log(await pg2.evaluate(()=>{updCheck();const tem=MENUS.Ajuda.some(i=>/atualiza/i.test(i[0]));
  return 'no navegador: aviso escondido '+$('#upd').hidden
   +' · sem o item no menu (a página já abre na última versão): '+!tem}));

 if(errs.length)console.log(errs.join('\n'));
 await b.close()})();
