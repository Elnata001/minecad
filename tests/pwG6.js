const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1300,height:900},deviceScaleFactor:1});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message+' @ '+String(e.stack||'').split('\n')[1]));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 await pg.evaluate(()=>{openP(newProject());P.els=[];B=build(P);render()});
 const r=await pg.evaluate(()=>{
  const out=[];
  const run=(t,setup)=>{tool=t;pts=null;RP=[];RMODE='rect';if(setup)setup();
   let d=null,er='';try{d=draftCells([8.5,8.5],null)}catch(e){er=e.message}
   out.push({t,n:d?d.cells.length:0,er,mods:d?d.n:0})};
  run('wall',()=>{pts=[2.5,8.5]});
  run('beam',()=>{pts=[2.5,8.5]});
  run('fence',()=>{pts=[2.5,8.5]});
  run('floor',()=>{pts=[2.5,2.5]});
  run('column');
  run('roof',()=>{pts=[2.5,2.5];RMODE='rect'});
  run('curtain',()=>{pts=[2.5,2.5];RMODE='rect'});
  run('curtain',()=>{RMODE='line';RP=[[2.5,8.5]]});
  run('stair',()=>{RP=[[2.5,8.5]]});
  run('block');
  run('door');run('sel');
  return out});
 r.forEach(x=>console.log(' ',x.t.padEnd(8),'células:',String(x.n).padStart(4),'módulos:',x.mods,x.er?('ERRO '+x.er):''));
 // ghost desenhado na planta
 await pg.evaluate(()=>{tool='wall';pts=[2.5,8.5];cur=[12.5,8.5];render()});
 await pg.screenshot({path:'/tmp/g1.png',clip:{x:200,y:120,width:700,height:500}});
 // ghost 3D
 const g3=await pg.evaluate(()=>{setView('3d');g3up(null);
  tool='wall';pts=[2.5,8.5];const k=[8,0,8];
  const dg=draftCells([k[0]+.5,k[2]+.5],k[1]);dgv3(dg&&dg.cells);
  return{vis:!!(DGV&&DGV.visible),count:DGV?DGV.count:0}});
 console.log(' ghost 3D:',JSON.stringify(g3));
 console.log(errs.length?errs.join('\n'):' sem erros de página');
 await b.close()})();
