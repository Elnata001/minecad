const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1366,height:880},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];const o=[];view='plan';lv=P.levels[0].id;cam.s=16;cam.x=12;cam.z=10;
  o.push('tipos de terreno padrão: '+P.types.topo.map(t=>t.name+' ('+t.ly.map(l=>l.m+'×'+l.t).join('+')+')').join(' · '));
  tool='topo';DMETS.topo='rect';toolClick([0.5,0.5],0,{});toolClick([24.5,20.5],0,{});
  const t=P.els[0];tool='tpt';
  for(const p of [[4,4,2],[20,4,5],[20,16,9],[4,16,6]]){DEF.tpt.z=p[2];topoPt([p[0],p[1]])}
  o.push('terreno com tipo: '+(typeOf(P,t.ty)||{}).name+' · parâmetros do elemento: '+JSON.stringify(Object.keys(t).filter(k=>['eq','mi','ref','qz','fill','by','dp','ly','mat'].includes(k))));
  // 3. profundidade pela soma das camadas
  let c=[...B.vox.values()].filter(v=>v.o===t.id);
  const colH=new Map();c.forEach(v=>{const k=v.x+','+v.z;colH.set(k,(colH.get(k)||0)+1)});
  o.push('3. profundidade = soma das espessuras (1+3+4=8): colunas com 8 blocos: '+[...colH.values()].filter(n=>n===8).length+' de '+colH.size);
  const ty=typeOf(P,t.ty);mutate(()=>{ty.ly=[{m:'sand',t:2},{m:'sandstone',t:3}]});
  c=[...B.vox.values()].filter(v=>v.o===t.id);const colH2=new Map();c.forEach(v=>{const k=v.x+','+v.z;colH2.set(k,(colH2.get(k)||0)+1)});
  o.push('   trocando para areia 2 + arenito 3: colunas com 5 blocos: '+[...colH2.values()].filter(n=>n===5).length+' · materiais '+[...new Set(c.map(v=>v.m))].join(','));
  // 2. os parâmetros vêm do tipo
  mutate(()=>{ty.eq=2;ty.mi=10;ty.qz='up'});
  o.push('2. tipo manda: equidistância '+tPar(t).eq+' · mestras '+tPar(t).mi+' · quantização '+tPar(t).qz+' · curvas geradas '+tinCntC(tinOf(t),tPar(t).eq,tPar(t).ref).length);
  mutate(()=>{ty.eq=1;ty.mi=5;ty.qz='near';ty.ly=[{m:'grass_block',t:1},{m:'dirt',t:3},{m:'stone',t:4}]});
  // dois terrenos, tipos diferentes
  tool='topo';toolClick([30.5,0.5],0,{});toolClick([44.5,20.5],0,{});
  const t2=P.els[P.els.length-1];tool='tpt';for(const p of [[33,4,1],[42,4,3],[42,16,2]]){DEF.tpt.z=p[2];topoPt([p[0],p[1]])}
  mutate(()=>{t2.ty=P.types.topo[2].id});
  o.push('   segundo terreno com tipo Areia: materiais '+[...new Set([...B.vox.values()].filter(v=>v.o===t2.id).map(v=>v.m))].join(','));
  // 5. informações no quadro
  sel=t.id;SELS=[t.id];tool='sel';render();
  o.push('5. barra sem fichas: '+!$('#props').innerHTML.includes('class="chips"')+' · info() tem '+info(t).length+' linhas');
  return o.join('\n')}));
 // menu de contexto + quadro
 console.log('   menu de contexto: '+await pg.evaluate(()=>{cmOpen(400,300,P.els[0].id);
  const t=[...document.querySelectorAll('#cmx [data-cm]')].map(x=>x.dataset.cm).join(',');cmClose();return t}));
 await pg.evaluate(()=>dlgElInfo(P.els[0].id));await pg.waitForTimeout(300);
 console.log('   quadro aberto com '+await pg.evaluate(()=>document.querySelectorAll('#dlg tr').length)+' linhas');
 {const r=await pg.evaluate(()=>{const q=document.querySelector('#dlg').getBoundingClientRect();return{x:q.x-10,y:q.y-10,width:q.width+20,height:q.height+20}});
  await pg.screenshot({path:'/tmp/tt_info.png',clip:r})}
 await pg.evaluate(()=>$('#dlg').close());
 // visualização
 await pg.evaluate(()=>{sel=P.els[0].id;SELS=[sel];tool='sel';render()});await pg.waitForTimeout(250);
 await pg.evaluate(()=>act('vis'));await pg.waitForTimeout(250);
 console.log('4. menu Visualização: '+await pg.evaluate(()=>{const v=document.querySelector('#vpop');
  return v?[...v.querySelectorAll('label')].map(l=>l.textContent.trim()).join(' | '):'não abriu'}));
 await pg.evaluate(()=>{const cb=document.querySelector('#vpop input[data-k="sc"]');cb.checked=false;cb.dispatchEvent(new Event('change',{bubbles:true}))});
 await pg.waitForTimeout(250);
 console.log('   desmarcar Curvas de nível: sc='+await pg.evaluate(()=>JSON.stringify(P.els[0].sc))+' · painel ainda aberto: '+await pg.evaluate(()=>!!document.querySelector('#vpop')));
 {const r=await pg.evaluate(()=>{const q=document.querySelector('#vpop').getBoundingClientRect();return{x:q.x-10,y:q.y-10,width:q.width+20,height:q.height+20}});
  await pg.screenshot({path:'/tmp/tt_vis.png',clip:r})}
 await pg.evaluate(()=>{vpClose();dlgTopoTypes()});await pg.waitForTimeout(350);
 {const r=await pg.evaluate(()=>{const q=document.querySelector('#dlg').getBoundingClientRect();return{x:q.x-10,y:q.y-10,width:q.width+20,height:Math.min(q.height+20,820)}});
  await pg.screenshot({path:'/tmp/tt_types.png',clip:r})}
 console.log(errs.join('\n')||'sem erros');await b.close()})();
