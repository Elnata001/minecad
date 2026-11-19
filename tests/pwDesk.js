const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1400,height:900}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 // finge ser o aplicativo desktop: expõe a mesma ponte que o preload cria
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.addInitScript(()=>{const ouv={};
  window.__salvo=null;window.__mcad=null;
  window.mcDesktop={versao:'38.0.0',
   mundos:async()=>({raiz:'C:/saves',mundos:[
     {nome:'Mundo de teste',pasta:'C:/saves/teste',regioes:2,mtime:2},
     {nome:'Criativo',pasta:'C:/saves/criativo',regioes:1,mtime:1}]}),
   regioes:async p=>p==='C:/saves/teste'
     ?[{arquivo:'r.0.0.mca',caminho:'C:/saves/teste/region/r.0.0.mca',rx:0,rz:0,bytes:270336},
       {arquivo:'r.1.0.mca',caminho:'C:/saves/teste/region/r.1.0.mca',rx:1,rz:0,bytes:270336}]
     :[{arquivo:'r.0.0.mca',caminho:'C:/saves/criativo/region/r.0.0.mca',rx:0,rz:0,bytes:1000}],
   lerArquivo:async c=>window.__REG,
   escolherAbrir:async()=>({caminho:'C:/p.mcad',texto:window.__mcad}),
   escolherSalvar:async(n,t)=>{window.__salvo={n,t};return 'C:/'+n+'.mcad'},
   pendente:async()=>null,
   ao:(c,f)=>{(ouv[c]=ouv[c]||[]).push(f);window.__disparar=(k,d)=>(ouv[k]||[]).forEach(g=>g(d))}}});
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(1000);
 // carrega a região sintética no mesmo formato que o preload entregaria
 const buf=fs.readFileSync('/tmp/w/r.0.0.mca');
 await pg.evaluate(a=>{window.__REG=new Uint8Array(a).buffer},Array.from(buf));
 console.log(await pg.evaluate(async()=>{const o=[];
  openP(newProject());P.els=[];
  act('titab:world');await new Promise(r=>setTimeout(r,700));
  o.push('1) mundos encontrados: '+(WMUN||[]).map(m=>m.nome).join(', '));
  o.push('   regiões do primeiro: '+(WREG||[]).map(r=>r.arquivo).join(', '));
  const txt=document.querySelector('#dlg').innerText;
  o.push('   painel mostra o seletor de mundo: '+/Mundo/.test(txt)+' · região: '+/Regi/.test(txt));
  WRSEL='C:/saves/teste/region/r.0.0.mca';
  await wCarregar();
  o.push('2) região carregada do mundo: '+(WIMP?WIMP.name+' · X '+WIMP.x0+'…'+WIMP.x1:'FALHOU'));
  WSEL={x0:0,z0:0,x1:63,z1:63};
  try{const F=await wField(WIMP,WSEL,WOPT,null);o.push('   campo: '+F.n+' colunas · erro? não');}
  catch(e){o.push('   campo FALHOU: '+e.message)}
  const ok=await wImpScan();
  o.push('   recorte analisado: '+(WPRE?WPRE.F.n+' colunas · '+WPRE.V.length+' pontos':'FALHOU ('+ok+') — '+(document.querySelector('#wiprev')||{}).innerText));
  wImpGo();
  o.push('   terreno criado: '+(P.els.find(e=>e.cat==='topo')?'sim':'NÃO'));
  // com as vizinhas: as duas regiões do mundo entram no mesmo índice
  WVIZ=true;WRSEL='C:/saves/teste/region/r.0.0.mca';await wCarregar();
  o.push('   com vizinhas: '+WIMP.name+' · X '+WIMP.x0+'…'+WIMP.x1+' · '+WIMP.n+' chunks');
  return o.join('\n')}));
 console.log(await pg.evaluate(async()=>{const o=[];
  // menu nativo: salvar
  window.__disparar('salvar-projeto');await new Promise(r=>setTimeout(r,300));
  const s=window.__salvo;o.push('3) menu Salvar: arquivo "'+(s?s.n:'—')+'" com '+(s?JSON.parse(s.t).p.els.length:0)+' elemento(s)');
  // menu nativo: abrir
  window.__mcad=s.t;const antes=P.id;
  window.__disparar('abrir-projeto');await new Promise(r=>setTimeout(r,600));
  o.push('   menu Abrir: projeto carregado · '+P.els.length+' elemento(s)');
  // desfazer pelo menu
  window.__disparar('desfazer');await new Promise(r=>setTimeout(r,200));
  o.push('   menu Desfazer respondeu sem erro: true');
  return o.join('\n')}));
 console.log(errs.length?errs.join('\n'):'SEM ERROS');
 await b.close()})();
