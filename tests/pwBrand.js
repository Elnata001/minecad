const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.addInitScript(()=>{window.mcDesktop={versao:'38',mundos:async()=>({raiz:null,mundos:[]}),
  regioes:async()=>[],lerArquivo:async()=>null,escolherAbrir:async()=>null,escolherSalvar:async()=>null,
  salvarEm:async()=>true,associar:async()=>{window.__assoc=true;return true},sobre:async()=>{window.__sobre=true;return true},
  pendente:async()=>null,ao:()=>{}}});
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(1000);
 console.log(await pg.evaluate(()=>{const o=[];
  o.push('1) título da página: '+document.title+' · favicon: '+(document.querySelector('link[rel=icon]')?'presente':'AUSENTE'));
  const br=document.querySelector('.brand');
  o.push('   marca no cabeçalho: "'+br.textContent.trim()+'" com logo: '+!!br.querySelector('img'));
  const wl=document.querySelector('#wel .wl'),wb=document.querySelector('#wel .wb');
  o.push('   tela inicial: logo '+(wl?wl.width+'px':'AUSENTE')+' · nome "'+(wb?wb.textContent:'')+'"');
  o.push('   nenhuma menção a MineCAD no corpo: '+!/MineCAD/.test(document.body.innerText));
  return o.join('\n')}));
 console.log(await pg.evaluate(()=>{const o=[];
  const arq=MENUS.Arquivo.map(x=>x[0]);
  o.push('2) menu Arquivo: '+arq.join(' | '));
  o.push('   Ajuda: '+MENUS.Ajuda.map(x=>x[0]).join(' | '));
  MENUS.Arquivo.find(x=>/Associar/.test(x[0]))[1]();
  MENUS.Ajuda.find(x=>/Sobre/.test(x[0]))[1]();
  return o.join('\n')}));
 await pg.waitForTimeout(200);
 console.log(await pg.evaluate(()=>'   itens do menu chamam o aplicativo: associar='+!!window.__assoc+' · sobre='+!!window.__sobre));
 console.log(await pg.evaluate(async()=>{welClose();
  const ev=k=>document.dispatchEvent(new KeyboardEvent('keydown',{key:k.k,ctrlKey:true,shiftKey:!!k.s,bubbles:true}));
  ev({k:'n',s:true});await new Promise(r=>setTimeout(r,150));
  return '3) Ctrl+Shift+N reabre a tela inicial: '+!$('#wel').hidden}));
 await pg.evaluate(()=>{welOpen()});await pg.waitForTimeout(400);
 await pg.screenshot({path:'/tmp/brand_wel.png',clip:{x:300,y:120,width:680,height:400}});
 await pg.evaluate(()=>{welClose()});await pg.waitForTimeout(300);
 await pg.screenshot({path:'/tmp/brand_top.png',clip:{x:0,y:0,width:560,height:60}});
 console.log(errs.length?errs.join('\n'):'SEM ERROS');
 await b.close()})();
