const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1360,height:880},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];
  const w=Object.assign({id:'s',cat:'stair',base:P.levels[0].id},JSON.parse(JSON.stringify(DEF.stair)),{top:'',w:1,pts:[[0.5,0.5],[4.5,0.5],[8.5,0.5]]});
  const pl=stairPlan(P,w);
  const por=new Map();pl.cells.forEach(c=>{const k=c[0]+','+c[2];if(!por.has(k)||por.get(k)[1]<c[1])por.set(k,c)});
  return 'reta com dois lances (X,Y): '+[...por.values()].sort((a,c)=>a[0]-c[0]).map(c=>c[0]+':'+c[1]).join(' ')}));
 console.log(await pg.evaluate(()=>{
  const w=Object.assign({id:'s',cat:'stair',base:P.levels[0].id},JSON.parse(JSON.stringify(DEF.stair)),{top:'',w:2,sd:'center',pts:[[0.5,0.5],[4.5,0.5],[4.5,4.5]]});
  const pl=stairPlan(P,w);
  return 'volta à direita, w=2: '+pl.N+' degraus · '+pl.lands+' patamar · blocos '+pl.cells.length+' · Z usados '+[...new Set(pl.cells.map(c=>c[2]))].sort((a,c)=>a-c).join(',')}));
 // vista 3D com duas escadas encadeadas
 await pg.evaluate(()=>{openP(newProject());P.els=[];
  P.els.push(mk(P,'stair',{pts:[[0.5,0.5],[4.5,0.5],[4.5,4.5],[0.5,4.5]],w:2,sd:'center',top:''},P.levels[0].id));
  B=build(P);sel=null;cam={x:3,z:3,s:46};view='plan';render()});
 await pg.waitForTimeout(300);
 const bb=await (await pg.$('#c2')).boundingBox();
 await pg.screenshot({path:'/tmp/es2.png',clip:{x:bb.x+bb.width/2-230,y:bb.y+bb.height/2-180,width:460,height:360}});
 console.log('blocos no projeto:',await pg.evaluate(()=>B.vox.size));
 console.log(errs.join('\n')||' sem erros');await b.close()})();
