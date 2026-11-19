const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1300,height:900}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];B=build(P);
  tool='floor';pts=[0,0];const q=[48.5,48.5];
  let t=performance.now();const d=draftCells(q,null);const t1=performance.now()-t;
  t=performance.now();for(let i=0;i<50;i++)draftCells(q,null);const t2=(performance.now()-t)/50;
  t=performance.now();for(let i=0;i<20;i++)draftCells([48.5+i*0.001,48.5],null);const t3=(performance.now()-t)/20;
  return 'piso 48x48 -> '+d.cells.length+' células | 1ª: '+t1.toFixed(1)+'ms | em cache: '+t2.toFixed(3)+'ms | recalculando: '+t3.toFixed(1)+'ms'}));
 console.log(errs.join('\n')||' sem erros');await b.close()})();
