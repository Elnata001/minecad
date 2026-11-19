const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];const o=[];view='plan';lv=P.levels[0].id;
  tool='topo';DMETS.topo='rect';toolClick([0.5,0.5],[0.5,0.5],{});toolClick([40.5,32.5],[40.5,32.5],{});
  const t=P.els[0];tool='tpt';
  for(const p of [[5,5,0],[36,5,6],[36,28,14],[5,28,8],[20,16,18]]){DEF.tpt.z=p[2];topoPt([p[0],p[1]])}
  // 5. edição de pontos
  tedStart(t.id);TED.sel=[4];tedZ(4);
  o.push('5. cota do ponto central 18 -> '+fmt(tinZ(tinOf(t),20,16))+' após editar para 4');
  TED.sel=[4];tedDel();
  o.push('   excluir: pontos '+t.tp.length+' · malha '+tinOf(t).T.length+' triângulos');
  undo();o.push('   desfazer: pontos '+P.els[0].tp.length);
  tedEnd();
  // 7. integração: consulta de cota
  const t2=P.els[0];
  o.push('7. topoZ(10,10)='+fmt(topoZ(10,10))+' · topoZ(100,100)='+topoZ(100,100));
  // 9. exportação
  mutate(()=>{t2.dp=5;t2.mat='grass_block';t2.m2='dirt';t2.m3='stone'});
  const cl=topoCells(t2),ys=cl.map(c=>c[1]),ms={};cl.forEach(c=>ms[c[4]]=(ms[c[4]]||0)+1);
  o.push('9. exportação: '+cl.length+' blocos · cotas '+Math.min.apply(null,ys)+'→'+Math.max.apply(null,ys)+' · materiais '+JSON.stringify(ms));
  o.push('   terreno fora de B.vox (não vira bloco na modelagem): '+![...B.vox.values()].some(v=>v.o===t2.id));
  const mp=mcPlan();o.push('   no plano de exportação: '+mp.ents.length+' entidades · avisos '+mp.iss.filter(i=>/terreno|Terreno/i.test(i[1])).length);
  // 11. importação CSV
  TIMP={sep:'auto',dec:'auto',cx:1,cy:2,cz:3,sc:1,hdr:true,name:'Levantamento',
   rows:[['Ponto','X','Y','Z'],['P01','0,00','0,00','102,50'],['P02','10,00','0,00','103,20'],['P03','10,00','10,00','104,10'],['P04','0,00','10,00','103,00'],['P05','5,00','5,00','106,00']]};
  const ps=tImpPts();o.push('11. CSV com decimal vírgula: '+ps.length+' pontos · '+JSON.stringify(ps[0])+' … cota máx '+Math.max.apply(null,ps.map(p=>p[2])));
  tImpGo();const ti=P.els[P.els.length-1],qi=tinOf(ti);
  o.push('    terreno importado: '+ti.name+' · '+ti.tp.length+' pontos · perímetro '+(ti.pts||[]).length+' vértices · '+qi.T.length+' triângulos');
  // 10. undo/redo
  const n0=P.els.length;undo();const n1=P.els.length;redo();
  o.push('10. desfazer/refazer: '+n0+' -> '+n1+' -> '+P.els.length+' elementos');
  return o.join('\n')}));
 console.log(errs.join('\n')||'sem erros');await b.close()})();
