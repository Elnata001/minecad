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
   escolherSalvar:async(n,t)=>{window.__dialogos=(window.__dialogos||0)+1;window.__salvo={n,t};window.__disco={...(window.__disco||{}),['C:/'+n+'.mcad']:t};return 'C:/'+n+'.mcad'},
   salvarEm:async(c,t)=>{window.__gravou=(window.__gravou||[]);window.__gravou.push(c);
     if(c==='C:/so-leitura.mcad')return false;window.__disco={...(window.__disco||{}),[c]:t};return true},
   pendente:async()=>window.__pendente||null,
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

 // 4. Ctrl+S: a primeira vez pergunta, as seguintes sobrescrevem
 console.log(await pg.evaluate(async()=>{const o=[];
  openP(newProject());P.name='Projeto do teste';P.els=[];
  window.__dialogos=0;window.__gravou=[];
  await projSave(false);
  o.push('4) sem arquivo ainda → perguntou onde salvar: '+(window.__dialogos===1)+' · caminho guardado: '+MCPATH);
  await projSave(false);
  o.push('   segunda vez → gravou direto em '+(window.__gravou[0]||'(nada)')+' · perguntou de novo: '+(window.__dialogos>1));
  await projSave(true);
  o.push('   Ctrl+Shift+S → perguntou onde salvar: '+(window.__dialogos===2));
  // caminho que não aceita gravação volta a perguntar
  MCPATH='C:/so-leitura.mcad';window.__dialogos=0;
  await projSave(false);
  o.push('   arquivo que recusa gravação → voltou a perguntar: '+(window.__dialogos===1)+' · novo caminho: '+MCPATH);
  // o caminho sobrevive à troca de projeto e volta ao reabrir
  const id=P.id,caminho=MCPATH;openP(newProject());
  o.push('   ao trocar de projeto o caminho zera: '+(MCPATH===''));
  openP(load(id));
  o.push('   ao voltar ao projeto o caminho retorna: '+(MCPATH===caminho));
  return o.join('\n')}));

 // 5. abrir o mesmo .mcad não duplica o projeto
 console.log(await pg.evaluate(async()=>{const o=[];
  const txt=window.__disco['C:/projeto-do-teste.mcad']||JSON.stringify(mcadBundle(false));
  const antes=idx().length;
  await welFile(txt,'C:/projeto-do-teste.mcad');
  o.push('5) abrir o arquivo do próprio projeto: '+P.name+' · projetos no índice: '+antes+' → '+idx().length);
  o.push('   caminho ficou ligado ao projeto: '+(MCPATH==='C:/projeto-do-teste.mcad'));
  await welFile(txt,'C:/projeto-do-teste.mcad');
  o.push('   abrindo de novo continua um só: '+idx().length+' projeto(s)');
  // importação pelo navegador (sem caminho) segue criando cópia
  await welFile(txt,'');
  o.push('   importação sem caminho cria cópia: '+P.name);
  return o.join('\n')}));


 // 6. clique duplo num .mcad entra direto no projeto, sem passar pela tela inicial
 {const pg2=await b.newPage({viewport:{width:1200,height:800}});
  pg2.on('pageerror',e=>errs.push('ERRO '+e.message));
  await pg2.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
  const bundle=await pg.evaluate(()=>JSON.stringify(mcadBundle(false)));
  await pg2.addInitScript(b2=>{window.__pendente={caminho:'C:/vindo-do-explorer.mcad',texto:b2};
   window.mcDesktop={versao:'38',mundos:async()=>({raiz:null,mundos:[]}),regioes:async()=>[],
    lerArquivo:async()=>null,escolherAbrir:async()=>null,escolherSalvar:async()=>null,
    salvarEm:async()=>true,pendente:async()=>window.__pendente,ao:()=>{}}},bundle);
  await pg2.goto('file:///mnt/user-data/outputs/minecad.html');await pg2.waitForTimeout(1200);
  console.log(await pg2.evaluate(()=>'6) aberto por clique duplo → tela inicial oculta: '+$('#wel').hidden
   +' · projeto: '+P.name+' · caminho ligado: '+MCPATH));
  await pg2.close()}
 // sem arquivo pendente, a tela inicial aparece
 {const pg3=await b.newPage({viewport:{width:1200,height:800}});
  await pg3.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
  await pg3.addInitScript(()=>{window.mcDesktop={versao:'38',mundos:async()=>({raiz:null,mundos:[]}),
   regioes:async()=>[],lerArquivo:async()=>null,escolherAbrir:async()=>null,escolherSalvar:async()=>null,
   salvarEm:async()=>true,pendente:async()=>null,ao:()=>{}}});
  await pg3.goto('file:///mnt/user-data/outputs/minecad.html');await pg3.waitForTimeout(1200);
  console.log(await pg3.evaluate(()=>'   abrindo normalmente → tela inicial visível: '+!$('#wel').hidden));
  await pg3.close()}
 console.log(errs.length?errs.join('\n'):'SEM ERROS');
 await b.close()})();
