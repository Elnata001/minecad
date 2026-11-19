const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];const o=[];view='plan';lv=P.levels[0].id;
  const mkTopo=(x0,z0,x1,z1,pts)=>{tool='topo';DMETS.topo='rect';toolClick([x0+.5,z0+.5],0,{});toolClick([x1+.5,z1+.5],0,{});
   const t=P.els[P.els.length-1];tool='tpt';for(const p of pts){DEF.tpt.z=p[2];topoPt([p[0],p[1]])}return t};
  // Teste 1 — terreno plano
  const t1=mkTopo(0,0,20,16,[[3,3,8],[17,3,8],[17,13,8],[3,13,8]]);
  let cells=[...B.vox.values()].filter(v=>v.o===t1.id);
  let tops=cells.filter(v=>v.tt);
  o.push('1 plano: '+cells.length+' blocos · topos em Y '+[...new Set(tops.map(v=>v.y))].join(',')+' · colunas '+tops.length+' (área '+(21*17)+')');
  o.push('   camadas no topo: '+[...new Set(tops.map(v=>v.m))].join(',')+' · abaixo: '+[...new Set(cells.filter(v=>!v.tt).map(v=>v.m))].join(','));
  // Teste 2 — inclinado
  mutate(()=>{P.els=[]});
  const t2=mkTopo(0,0,24,8,[[2,4,0],[22,4,10]]);
  cells=[...B.vox.values()].filter(v=>v.o===t2.id);
  const byX=new Map();cells.filter(v=>v.tt).forEach(v=>{if(!byX.has(v.x)||byX.get(v.x)<v.y)byX.set(v.x,v.y)});
  o.push('2 inclinado: topo por X '+[...byX.entries()].sort((a,b)=>a[0]-b[0]).filter((_,i)=>i%3===0).map(e=>e[0]+':'+e[1]).join(' '));
  const ys=[...byX.values()];o.push('   degraus monotônicos: '+ys.every((y,i)=>!i||y>=ys[i-1]));
  // sem lacunas: toda coluna tem blocos contíguos
  const col=new Map();cells.forEach(v=>{const k=v.x+','+v.z;(col.get(k)||col.set(k,[]).get(k)).push(v.y)});
  let gaps=0;for(const[k,a] of col){a.sort((x,y)=>x-y);for(let i=1;i<a.length;i++)if(a[i]!==a[i-1]+1)gaps++}
  o.push('   colunas '+col.size+' · lacunas internas '+gaps);
  // vizinhança: sem degrau aberto entre colunas adjacentes
  const top=new Map();cells.filter(v=>v.tt).forEach(v=>top.set(v.x+','+v.z,v.y));
  const low=new Map();col.forEach((a,k)=>low.set(k,Math.min.apply(null,a)));
  let open=0;for(const[k,y] of top){const[x,z]=k.split(',').map(Number);
   for(const d of [[1,0],[-1,0],[0,1],[0,-1]]){const n=top.get((x+d[0])+','+(z+d[1]));
    if(n!==undefined&&n<y&&low.get(k)>n)open++}}
  o.push('   taludes vazados: '+open);
  // Teste 6/7 — profundidade e camadas
  mutate(()=>{t2.dp=8});
  let c2=[...B.vox.values()].filter(v=>v.o===t2.id);
  o.push('6 profundidade 4->8: '+cells.length+' -> '+c2.length+' blocos · topos iguais: '+
   (JSON.stringify([...top.entries()].sort())===JSON.stringify([...c2.filter(v=>v.tt).map(v=>[v.x+','+v.z,v.y])].sort())));
  mutate(()=>{t2.ly=[{m:'sand',t:2},{m:'sandstone',t:0}]});
  c2=[...B.vox.values()].filter(v=>v.o===t2.id);
  o.push('7 camadas areia/arenito: '+[...new Set(c2.map(v=>v.m))].join(',')+' · topo '+[...new Set(c2.filter(v=>v.tt).map(v=>v.m))].join(','));
  // preenchimento até cota fixa
  mutate(()=>{t2.fill='base';t2.by=-5});
  c2=[...B.vox.values()].filter(v=>v.o===t2.id);
  o.push('   até cota -5: '+c2.length+' blocos · menor Y '+Math.min.apply(null,c2.map(v=>v.y)));
  // Teste 9 — exportação = visualização
  mutate(()=>{t2.fill='depth';t2.dp=4});
  const mp=mcPlan(),nt=[...B.vox.values()].filter(v=>v.o===t2.id).length;
  o.push('9 exportação: '+mp.ents.length+' entidades · blocos do terreno no modelo '+nt+' · iguais: '+(mp.ents.length===B.vox.size));
  // conversão desligada
  mutate(()=>{t2.bk=false});
  o.push('   conversão desligada: blocos '+[...B.vox.values()].filter(v=>v.o===t2.id).length+' · malha TIN intacta '+tinOf(t2).T.length+' triângulos');
  mutate(()=>{t2.bk=true});
  return o.join('\n')}));
 console.log(errs.join('\n')||'sem erros');await b.close()})();
