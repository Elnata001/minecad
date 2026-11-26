/* Modelar pela fachada e pelo corte: selecionar, inserir, hospedar porta na parede e, para as
   ferramentas que pedem a grade vista de cima, o aviso com as plantas para escolher ali mesmo. */
const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:700}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);

 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];
  const l0=P.levels[0].id;
  P.els.push(mk(P,'wall',{x1:0,z1:0,x2:0,z2:10,h:5},l0));
  B=build(P);
  view='sec';SV={id:'E',cam:{u:-5,y:2,s:30}};tool='sel';sel=null;SELS=[];render();
  return 'parede de 10 blocos na Fachada Leste · células: '+SEC.cells.size+' · blocos: '+B.vox.size}));

 /* a tela da célula (u,y) */
 const at=async(u,y)=>await pg.evaluate(([u,y])=>{const r=$('#c3').getBoundingClientRect();
  return[r.left+(u+.5-SEC.cu)*SEC.S+SEC.w/2,r.top+SEC.h/2-(y+.5-SEC.cy)*SEC.S]},[u,y]);

 /* 1. clicar numa célula da parede seleciona a parede */
 let[x,y]=await at(-4,2);await pg.mouse.click(x,y);await pg.waitForTimeout(150);
 console.log(await pg.evaluate(()=>{const w=P.els.find(e=>e.id===sel);
  return '1. seleção pelo clique: '+(w?w.cat:'nada')+' · destacada no desenho: '+(selSet().length===1)}));

 /* 2. bloco numa célula vazia ao lado da parede: entra no plano da vista, na cota clicada */
 await pg.evaluate(()=>{tool='block';render()});
 ;[x,y]=await at(-4,6);await pg.mouse.click(x,y);await pg.waitForTimeout(200);
 console.log(await pg.evaluate(()=>{const w=P.els[P.els.length-1],pa=P.els[0];
  /* a célula clicada estava vazia (acima da parede): a profundidade vem da parede vizinha */
  let px=null;for(const v of B.vox.values())if(v.o===pa.id)px=v.x;
  return '2. bloco inserido em x='+w.x1+' z='+w.z1+' off='+w.off
   +' · na mesma profundidade da parede (x='+px+'): '+(Math.floor(w.x1)===px)
   +' · na cota clicada: '+(w.off===6)}));

 /* 3. porta: a parede clicada vira hospedeira, com a posição medida ao longo dela */
 await pg.evaluate(()=>{tool='door';render()});
 ;[x,y]=await at(-7,1);await pg.mouse.click(x,y);await pg.waitForTimeout(200);
 console.log(await pg.evaluate(()=>{const d=P.els.filter(e=>e.cat==='door').pop();
  const h=d&&P.els.find(e=>e.id===d.host);
  /* a célula z=7 tem centro em 7,5 e a posição da porta é medida em linhas de grade */
  return '3. porta: '+(d?'hospedada em '+(h?h.cat:'?')+' na posição '+d.pos
   +' · bate com a célula clicada: '+(d.pos===8)
   +' · dentro da parede: '+(d.pos>=0&&d.pos<=10):'NÃO INSERIU')}));

 /* 4. parede: o aviso com as plantas, e o clique não insere nada */
 const n0=await pg.evaluate(()=>{act('tool:wall');return P.els.length});
 await pg.waitForTimeout(150);
 console.log(await pg.evaluate(()=>{const ap=$('#askpl');
  return '4. aviso sobre a vista: visível='+!ap.hidden
   +' · plantas oferecidas: '+[...ap.querySelectorAll('[data-a^="plan:"]')].length
   +' de '+P.levels.length
   +' · tem Cancelar: '+!!ap.querySelector('[data-a="tool:sel"]')}));
 ;[x,y]=await at(-4,3);await pg.mouse.click(x,y);await pg.waitForTimeout(150);
 console.log(await pg.evaluate(n0=>'   clique com a parede ativa: '+n0+' -> '+P.els.length+' elementos'
  +(P.els.length===n0?' (nada inserido)':' (INSERIU)'),n0));

 /* 5. o botão da planta troca a vista e mantém a ferramenta */
 await pg.click('#askpl [data-a^="plan:"]');await pg.waitForTimeout(200);
 console.log(await pg.evaluate(()=>'5. depois do botão: vista='+view+' · nível='+lvl().name+' · ferramenta='+tool
  +' · aviso escondido: '+$('#askpl').hidden));

 /* 6. de volta à fachada, as ferramentas que trabalham por lá não mostram aviso */
 console.log(await pg.evaluate(()=>{view='sec';SV={id:'E',cam:{u:-5,y:2,s:30}};
  const r=[];for(const t of['sel','block','column','comp','door','trap','move','rot','trim','split']){
   tool=t;render();if(!$('#askpl').hidden)r.push(t)}
  tool='sel';render();
  return '6. ferramentas que ainda pedem planta entre as de inserção direta: '+(r.length?r.join(', '):'nenhuma')}));

 /* 7. as de traçado em planta pedem, todas */
 console.log(await pg.evaluate(()=>{const r=[];
  for(const t of['wall','floor','roof','fence','beam','window','stair','curtain','cut','dim','txt','ln','tag']){
   tool=t;render();if($('#askpl').hidden)r.push(t)}
  tool='sel';render();
  return '7. ferramentas de planta que não pediram: '+(r.length?r.join(', ')+' — FALHOU':'nenhuma (todas pedem)')}));

 if(errs.length)console.log(errs.join('\n'));
 await b.close()})();
