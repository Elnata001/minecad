const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1360,height:880}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);
 const dump=await pg.evaluate(()=>{openP(newProject());P.els=[];
  const e=mk(P,'stair',{w:2,sd:'left',top:'',pts:[[0.5,0.5],[4.5,0.5],[8.5,6.5],[12.5,6.5]],br:[2]},P.levels[0].id);
  const pl=stairPlan(P,e);
  const land=pl.cells.filter(c=>c[4]&&c[4].indexOf('stairs')<0),tre=pl.cells.filter(c=>c[4]&&c[4].indexOf('stairs')>=0);
  const g=a=>a.map(c=>c[0]+','+c[1]+','+c[2]).sort().join(' ');
  return{N:pl.N,lands:pl.lands,degraus:tre.length,patamar:land.length,pat:g(land),
   fim1:g(tre.filter(c=>c[2]<=1).slice(-2)),ini2:g(tre.filter(c=>c[2]>=6).slice(0,2))}});
 console.log('degraus:',dump.degraus,'| blocos de patamar:',dump.patamar,'| patamares contados:',dump.lands);
 console.log('células de patamar (x,y,z):',dump.pat);
 console.log('último degrau da parte 1:',dump.fim1,'| primeiro da parte 2:',dump.ini2);
 // largura 1 e partes coladas
 console.log(await pg.evaluate(()=>{
  const e=mk(P,'stair',{w:1,top:'',pts:[[0.5,0.5],[4.5,0.5],[5.5,0.5],[9.5,0.5]],br:[2]},P.levels[0].id);
  const pl=stairPlan(P,e);return 'w=1 coladas: patamares '+pl.lands+' · degraus '+pl.N}));
 console.log(await pg.evaluate(()=>{
  const e=mk(P,'stair',{w:3,top:'',pts:[[0.5,0.5],[4.5,0.5],[9.5,9.5],[13.5,9.5]],br:[2]},P.levels[0].id);
  const pl=stairPlan(P,e);const land=pl.cells.filter(c=>c[4]&&c[4].indexOf('stairs')<0);
  return 'w=3 separadas: blocos de patamar '+land.length+' (dois quadrados 3×3 ligados em L)'}));
 console.log(errs.join('\n')||' sem erros');await b.close()})();
