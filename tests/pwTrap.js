const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);

 console.log(await pg.evaluate(()=>{const o=[];
  o.push('1) ferramenta na lista: '+TOOLS.some(t=>t[0]==='trap'));
  o.push('   subferramenta de Porta: '+JSON.stringify(SUBT.door)+' · pai '+SUBOF.trap);
  o.push('   categoria: '+CATS.trap.l+' · sem voxelizador próprio: '+(CATS.trap.vox===undefined));
  o.push('   materiais do alçapão: '+matOpts('trap').length+' (todos tipo t: '+matOpts('trap').every(m=>MATS[m[0]][2]==='t')+')');
  o.push('   a ferramenta Bloco já não oferece alçapões: '+!matOpts('block').some(m=>MATS[m[0]][2]==='t'));
  return o.join('\n')}));

 // 2. inserção sobre um piso: recorta a célula
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];view='plan';lv=P.levels[0].id;cam.s=26;cam.x=6;cam.z=5;
  const a=lv,f=mk(P,'floor',{pts:[[.5,.5],[10.5,8.5]],pk:'rect',closed:true,off:0,mat:'oak_planks'},a);P.els.push(f);
  B=build(P);const antes=[...B.vox.values()].filter(v=>v.o===f.id).length;
  tool='trap';toolClick([4.5,3.5],[4.5,3.5],{});
  const t=P.els.find(e=>e.cat==='trap'),cel=[...B.vox.values()].filter(v=>v.o===t.id);
  const depois=[...B.vox.values()].filter(v=>v.o===f.id).length;
  window.__t=t.id;
  return '2) piso antes '+antes+' células · depois '+depois+' (recortou '+(antes-depois)+')'
   +'\n   alçapão: '+cel.length+' célula em y='+cel[0].y+' (piso em y='+(Math.round(P.levels[0].elev)-1)+')'
   +'\n   estado: '+JSON.stringify(cel[0].td)+' · marcado como item de porta? '+!!cel[0].d
   +'\n   nome: '+t.name+' · nível '+(t.base===lv)}));

 // 3. quantitativos e exportação
 console.log(await pg.evaluate(()=>{const t=P.els.find(e=>e.cat==='trap'),v=[...B.vox.values()].find(x=>x.o===t.id);
  const st=mcSt(v),lin=mcPlan();
  return '3) blocos do elemento: '+B.per[t.id]+' · na tabela de blocos conta como '+(v.d?'Item':'Bloco')
   +'\n   estado exportado: minecraft:'+v.m+st
   +'\n   saiu no plano: '+(JSON.stringify(lin).indexOf('trapdoor')>=0)}));

 // 4. abrir e fechar + dobradiça
 console.log(await pg.evaluate(()=>{const t=P.els.find(e=>e.cat==='trap'),o=[],cel=()=>[...B.vox.values()].find(x=>x.o===t.id);
  o.push('4) fechada: '+JSON.stringify(cel().td));
  mutate(()=>{t.op=true});o.push('   aberta: '+JSON.stringify(cel().td));
  mutate(()=>{t.hf='bottom'});o.push('   abre para cima: '+JSON.stringify(cel().td));
  sel=t.id;tool='sel';flipExt();o.push('   espaço gira a dobradiça: '+cel().td.fc);
  flipExt();flipExt();flipExt();o.push('   quatro giros voltam: '+cel().td.fc);
  mutate(()=>{t.op=false;t.hf='top'});return o.join('\n')}));

 // 5. geometria 3D: nunca cubo
 console.log(await pg.evaluate(()=>{const t=P.els.find(e=>e.cat==='trap'),o=[];
  const geo=()=>{const r=[];for(const m of meshes)if((m.userData.o||[]).includes?m.userData.o.includes(t.id):m.userData.o===t.id)r.push(m.geometry.__k);return r};
  view='3d';render();o.push('5) fechada no topo: '+geo().join(','));
  mutate(()=>{t.hf='bottom'});render();o.push('   fechada na base: '+geo().join(','));
  mutate(()=>{t.op=true});render();o.push('   aberta: '+geo().join(','));
  mutate(()=>{t.op=false;t.hf='top'});render();
  o.push('   nenhuma delas é cubo: '+!geo().some(k=>String(k).indexOf('cube')===0));
  view='plan';render();return o.join('\n')}));

 // 6. bloco de alçapão de projeto antigo
 console.log(await pg.evaluate(()=>{const bk=mk(P,'block',{x1:8.5,z1:6.5,mat:'oak_trapdoor',fc:'east',hf:'bottom'},lv);P.els.push(bk);
  B=build(P);const v=[...B.vox.values()].find(x=>x.o===bk.id);
  return '6) bloco avulso antigo com material de alçapão: '+JSON.stringify(v&&v.td)}));


 // 7. casos de borda
 console.log(await pg.evaluate(()=>{const o=[];
  // sem piso embaixo
  openP(newProject());P.els=[];lv=P.levels[0].id;view='plan';
  const t1=mk(P,'trap',{x1:3.5,z1:3.5},lv);P.els.push(t1);B=build(P);
  o.push('7) sozinho, sem piso: '+[...B.vox.values()].filter(v=>v.o===t1.id).length+' célula · células no projeto '+B.vox.size);
  // piso de duas camadas: recorta a espessura inteira
  openP(newProject());P.els=[];lv=P.levels[0].id;
  const f=mk(P,'floor',{pts:[[.5,.5],[6.5,6.5]],pk:'rect',closed:true,off:0,t:3,mat:'stone'},lv);P.els.push(f);
  const t2=mk(P,'trap',{x1:3.5,z1:3.5},lv);P.els.push(t2);B=build(P);
  const col=[...B.vox.values()].filter(v=>v.x===3&&v.z===3);
  o.push('   piso de 3 camadas: coluna com '+col.length+' célula(s) · dona: '+(col.length===1&&col[0].o===t2.id?'o alçapão':'ERRO'));
  // desfazer e refazer
  sel=t2.id;mutate(()=>{t2.op=true});const a1=[...B.vox.values()].find(v=>v.o===t2.id).td.op;
  undo();const a2=[...B.vox.values()].find(v=>v.o===t2.id).td.op;
  redo();const a3=[...B.vox.values()].find(v=>v.o===t2.id).td.op;
  o.push('   abrir → desfazer → refazer: '+a1+' / '+a2+' / '+a3);
  // salvar e reabrir
  const js=JSON.parse(JSON.stringify(P));openP(migrate(js));
  const t3=P.els.find(e=>e.cat==='trap');
  o.push('   depois de salvar e reabrir: '+(t3?JSON.stringify([...B.vox.values()].find(v=>v.o===t3.id).td):'PERDIDO'));
  return o.join('\n')}));
 await pg.waitForTimeout(300);
 await pg.screenshot({path:'/tmp/trap_plan.png',clip:{x:76,y:140,width:560,height:430}});
 console.log(errs.length?errs.join('\n'):'SEM ERROS');
 await b.close()})();
