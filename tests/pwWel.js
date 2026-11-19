const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);

 // 1. abre na tela inicial, não no projeto
 console.log(await pg.evaluate(()=>'1) tela inicial visível ao abrir: '+!$('#wel').hidden
  +' · cobre a tela: '+(getComputedStyle($('#wel')).position==='fixed')));

 // 2. semeia projetos e confere as miniaturas
 console.log(await pg.evaluate(async()=>{const o=[];
  // três projetos com conteúdo diferente
  for(const[nome,n] of [['Casa',6],['Galpão',14],['Torre',3]]){
   const p=newProject();p.name=nome;p.els=[];
   p.els.push(mk(p,'floor',{pts:[[.5,.5],[n+.5,n*.6+.5]],pk:'rect',closed:true,off:0,mat:'oak_planks'},p.levels[0].id));
   const w=mkWall(p,[.5,.5],[n+.5,.5],p.levels[0].id);w.h=4;p.els.push(w);
   LS.s('mc:p:'+p.id,JSON.stringify(p));
   LS.s('mc:idx',JSON.stringify([{id:p.id,name:nome},...idx()]))}
  welOpen();await new Promise(r=>setTimeout(r,200));
  const cards=[...document.querySelectorAll('#wel .wc')];
  o.push('2) cartões: '+cards.length+' · nomes: '+cards.map(c=>c.querySelector('b').textContent).join(', '));
  o.push('   legendas: '+cards.map(c=>c.querySelector('i').textContent).join(' | '));
  // a miniatura desenhou algo?
  const pintados=cards.map(c=>{const cv=c.querySelector('canvas'),d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;
   let n=0;for(let i=3;i<d.length;i+=4)if(d[i]>0)n++;return n});
  o.push('   pixels desenhados em cada miniatura: '+pintados.join(', ')+' · todas pintaram: '+pintados.every(n=>n>400));
  o.push('   botões: '+[...document.querySelectorAll('#wel .wa button')].map(x=>x.textContent).join(' / '));
  return o.join('\n')}));

 // 3. clicar num cartão abre o projeto e fecha a tela
 console.log(await pg.evaluate(async()=>{const c=document.querySelector('#wel .wc');
  const nome=c.querySelector('b').textContent;c.click();await new Promise(r=>setTimeout(r,200));
  return '3) cartão "'+nome+'" → projeto aberto: '+P.name+' · tela fechada: '+$('#wel').hidden
   +' · elementos: '+P.els.length}));

 // 4. novo projeto
 console.log(await pg.evaluate(async()=>{welOpen();await new Promise(r=>setTimeout(r,100));
  document.querySelector('#wel [data-a="wnew"]').click();await new Promise(r=>setTimeout(r,200));
  return '4) Novo projeto → '+P.name+' · tela fechada: '+$('#wel').hidden}));

 // 5. volta pela opção do menu
 console.log(await pg.evaluate(()=>{act('welcome');const n=document.querySelectorAll('#wel .wc').length;
  welClose();return '5) menu Arquivo › Tela inicial reabre com '+n+' cartão(ões)'}));

 // 6. no navegador o Ctrl+S segue levando à exportação
 console.log(await pg.evaluate(async()=>{projSave(false);await new Promise(r=>setTimeout(r,250));
  const t=$('#dlg').open?$('#dlg').innerText.split('\n')[0]:'(nada)';$('#dlg').close();
  return '6) sem aplicativo, Ctrl+S abre: '+t}));
 console.log(errs.length?errs.join('\n'):'SEM ERROS');
 await b.close()})();
