const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1200,height:800}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message+' @ '+String(e.stack||'').split('\n')[1]));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 const zf=JSON.parse(fs.readFileSync('/tmp/zipfiles.json','utf8'));
 await pg.addInitScript(z=>{window.JSZip={loadAsync:async()=>({files:z,file:p=>({async:async()=>z[p]})})}},zf);
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 const r=await pg.evaluate(async()=>{
  const q=await packBuild(new Blob(['x']));PACK=q.tex;PACKN='jar';T3.clear();PAT.clear();TXON=true;
  openP(newProject());P.els=[];
  P.els.push(mk(P,'beam',{x1:.5,z1:.5,x2:6.5,z2:.5,mat:'oak_log',bw:1,bh:1,off:3},lv));   // viga no eixo X
  P.els.push(mk(P,'beam',{x1:9.5,z1:.5,x2:9.5,z2:6.5,mat:'oak_log',bw:1,bh:1,off:3},lv)); // viga no eixo Z
  P.els.push(mk(P,'column',{x1:14.5,z1:.5,mat:'oak_log',sx:1,sz:1,h:4},lv));              // pilar em pé
  B=build(P);setView('3d');
  const cells=[...B.vox.values()];
  const side=PACK.oak_log.s,end=PACK.oak_log.t;
  const info=[];
  for(const m of meshes){const v=B.vox.get([...m.userData.o].length?'':'')||null;
   const mats=Array.isArray(m.material)?m.material:[m.material];
   info.push({geo:m.geometry.__k,n:m.count,faces:mats.length,
    pontas:mats.length===6?mats.map((x,i)=>(x.map&&x.map.image===end?'topo':'casca')).join(','):'-'})}
  return{eixos:[...new Set(cells.map(c=>c.m+':'+(c.ax||'y')))].join(' | '),malhas:info}});
 console.log('eixos das células:',r.eixos);
 r.malhas.forEach(m=>console.log('  malha',m.geo.padEnd(6),'×'+m.n,'faces [+X,-X,+Y,-Y,+Z,-Z] =',m.pontas));
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
