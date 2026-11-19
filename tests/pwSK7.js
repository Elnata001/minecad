const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1360,height:880}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);
 await pg.evaluate(()=>{openP(newProject());P.els=[];
  const f=mk(P,'floor',{pts:[[0.5,0.5],[10.5,0.5],[10.5,7.5],[0.5,7.5]]},P.levels[0].id);P.els.push(f);
  B=build(P);sel=f.id;tool='sel';cam={x:6,z:4,s:34};render();act('sk')});
 const T=()=>pg.evaluate(()=>{const d=[...document.querySelectorAll('.tst')].pop();return d?(d.classList.contains('err')?'ERRO: ':'ok: ')+d.dataset.t:'—'});
 const st=()=>pg.evaluate(()=>SK?SK.P.length+'v/'+SK.E.length+'a · '+skStatus():'fora');
 // Repartir cria vértice e permite puxar o meio da aresta
 console.log(await pg.evaluate(()=>{act('tool:split');const q=[5.5,0.5];cur=q.slice();skDown(q);return 'repartir: '+SK.P.length+'v/'+SK.E.length+'a'}));
 console.log(await pg.evaluate(()=>{const i=SK.sv;SK.P[i]=[5.5,-2.5];skWeld();return 'vértice novo puxado: '+skStatus()}));
 // duas linhas soltas unidas pelo Aparar
 console.log(await pg.evaluate(()=>{act('skclr');
  [[0.5,0.5],[8.5,0.5]].forEach(q=>{cur=q.slice();skPen(q)});SK.cur=-1;
  [[12.5,3.5],[12.5,9.5]].forEach(q=>{cur=q.slice();skPen(q)});SK.cur=-1;
  return 'duas linhas soltas: '+SK.P.length+'v/'+SK.E.length+'a'}));
 console.log(await pg.evaluate(()=>{act('tool:trim');
  const mid=i=>{const[a,b]=SK.E[i];return[(SK.P[a][0]+SK.P[b][0])/2,(SK.P[a][1]+SK.P[b][1])/2]};
  let q=mid(0);cur=q.slice();skDown(q);q=mid(1);cur=q.slice();skDown(q);
  return 'após aparar: '+SK.P.length+'v/'+SK.E.length+'a · '+JSON.stringify(SK.P)}));
 console.log('  ',await T());
 // fecha o triângulo e conclui
 console.log(await pg.evaluate(()=>{act('skmode:draw');
  const d={};SK.E.forEach(([x,y])=>{d[x]=(d[x]||0)+1;d[y]=(d[y]||0)+1});
  const soltas=SK.P.map((q,i)=>[q,i]).filter(([,i])=>(d[i]||0)<2).map(([q])=>q.slice());
  cur=soltas[0].slice();skPen(soltas[0]);cur=soltas[1].slice();skPen(soltas[1]);SK.cur=-1;
  return 'ligando as duas pontas soltas: '+skStatus()}));
 await pg.evaluate(()=>act('skok'));await pg.waitForTimeout(250);
 console.log('concluído:',await pg.evaluate(()=>!SK),'| piso:',await pg.evaluate(()=>JSON.stringify(P.els[0].pts)));
 console.log(errs.join('\n')||' sem erros');await b.close()})();
