const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:760}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];const a=P.levels[0].id,o=[];
  const mkT=(x)=>Object.assign({id:uid(),cat:'topo',name:'T',base:a,off:0,tp:[],bl:[],pad:[]},x);
  // Teste 1 — terreno plano (4 pontos na mesma cota)
  const t1=mkT({pts:[[0.5,0.5],[20.5,0.5],[20.5,20.5],[0.5,20.5]],closed:true,
   tp:[[2,2,10],[18,2,10],[18,18,10],[2,18,10]]});P.els.push(t1);
  let q=tinOf(t1);
  o.push('1 plano: '+q.T.length+' triângulos · cotas '+q.zmin+'→'+q.zmax+' · área plana '+fmt(q.ap)+' · área 3D '+fmt(q.a3)+' · incl. média '+fmt(q.sl)+'°');
  o.push('  cota no centro: '+tinZ(q,10,10)+' · fora do perímetro: '+tinZ(q,40,40));
  // Teste 2 — terreno inclinado
  const t2=mkT({pts:[[0.5,0.5],[20.5,0.5],[20.5,20.5],[0.5,20.5]],closed:true,
   tp:[[2,2,0],[18,2,0],[18,18,20],[2,18,20]]});P.els.push(t2);
  q=tinOf(t2);
  const zs=[2,6,10,14,18].map(z=>fmt(tinZ(q,10,z)));
  o.push('2 inclinado: cotas em Z=2,6,10,14,18 -> '+zs.join(', ')+' (deve crescer linear)');
  o.push('  área plana '+fmt(q.ap)+' · área 3D '+fmt(q.a3)+' (3D > plana: '+(q.a3>q.ap)+') · incl. média '+fmt(q.sl)+'°');
  // Teste 3 — irregular + curvas de nível
  const t3=mkT({pts:[[0.5,0.5],[30.5,0.5],[30.5,30.5],[0.5,30.5]],closed:true,
   tp:[[5,5,0],[25,5,4],[25,25,12],[5,25,6],[15,15,16]]});P.els.push(t3);
  q=tinOf(t3);
  const cn=tinCnt(q,2,0);
  o.push('3 irregular: '+q.T.length+' triângulos · cotas '+fmt(q.zmin)+'→'+fmt(q.zmax));
  o.push('  curvas a cada 2: '+cn.length+' níveis · '+cn.map(c=>c.y+'('+c.ls.length+')').join(' '));
  o.push('  pontos preservados: '+[[5,5,0],[25,5,4],[15,15,16]].map(p=>fmt(tinZ(q,p[0],p[1]))+'='+p[2]).join(' '));
  // Teste 6 — plataforma
  const t4=mkT({pts:[[0.5,0.5],[30.5,0.5],[30.5,30.5],[0.5,30.5]],closed:true,
   tp:[[2,2,0],[28,2,0],[28,28,20],[2,28,20]],pad:[{id:uid(),pts:[[10,10],[20,10],[20,20],[10,20]],y:10}]});P.els.push(t4);
  const qo=tinOf(t4,false),qp=tinOf(t4,true);
  o.push('6 plataforma: original no centro '+fmt(tinZ(qo,15,15))+' · projetado '+fmt(tinZ(qp,15,15))
   +' · cantos da plataforma '+[[11,11],[19,19],[11,19]].map(p=>fmt(tinZ(qp,p[0],p[1]))).join(',')
   +' · fora dela (5,5) '+fmt(tinZ(qp,5,5)));
  // desempenho
  const N=400,tp=[];for(let i=0;i<N;i++)tp.push([Math.random()*100,Math.random()*100,Math.sin(i)*8+10]);
  const t5=mkT({pts:[[0.5,0.5],[100.5,0.5],[100.5,100.5],[0.5,100.5]],closed:true,tp});P.els.push(t5);
  const t0=performance.now();const q5=tinOf(t5);const ms=performance.now()-t0;
  const t6=performance.now();tinCnt(q5,1,0);const ms2=performance.now()-t6;
  o.push('desempenho: '+N+' pontos -> '+q5.V.length+' vértices, '+q5.T.length+' triângulos em '+ms.toFixed(0)+' ms · curvas em '+ms2.toFixed(0)+' ms');
  o.push('consulta (1000 amostras): '+(()=>{const s=performance.now();for(let i=0;i<1000;i++)tinZ(q5,Math.random()*100,Math.random()*100);return (performance.now()-s).toFixed(0)+' ms'})());
  return o.join('\n')}));
 console.log(errs.join('\n')||'sem erros');await b.close()})();
