const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:700}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);
 const mapa=await pg.evaluate(()=>{openP(newProject());P.els=[];
  const casos=[['parte 1 em X, parte 2 em X',[[0.5,0.5],[4.5,0.5],[8.5,6.5],[12.5,6.5]]],
   ['parte 1 em Z, parte 2 em X',[[0.5,0.5],[0.5,4.5],[6.5,8.5],[10.5,8.5]]],
   ['parte 2 para trás',[[6.5,0.5],[10.5,0.5],[2.5,5.5],[0.5,5.5]]]];
  const out=[];
  for(const[nome,pts]of casos){
   const e=mk(P,'stair',{w:2,top:'',pts,br:[2]},P.levels[0].id),pl=stairPlan(P,e);
   const deg=new Set(),pat=new Set();
   pl.cells.forEach(c=>{(c[4]&&c[4].indexOf('stairs')>=0?deg:pat).add(c[0]+','+c[2])});
   let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;
   [...deg,...pat].forEach(k=>{const[x,z]=k.split(',').map(Number);x0=Math.min(x0,x);x1=Math.max(x1,x);z0=Math.min(z0,z);z1=Math.max(z1,z)});
   const L=[];for(let z=z0;z<=z1;z++){let r='';for(let x=x0;x<=x1;x++)r+=deg.has(x+','+z)?'#':pat.has(x+','+z)?'=':'.';L.push(r)}
   out.push(nome+'  (# degrau, = patamar)\n'+L.join('\n'))}
  return out.join('\n\n')});
 console.log(mapa);
 console.log(errs.join('\n')||'\n sem erros');await b.close()})();
