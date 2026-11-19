const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:700}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];const o=[];
  const mapa=(cells,t)=>{const H=new Map();let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;
   cells.forEach(c=>{const k=c[0]+','+c[2];if(!H.has(k)||H.get(k)<c[1])H.set(k,c[1]);
    x0=Math.min(x0,c[0]);x1=Math.max(x1,c[0]);z0=Math.min(z0,c[2]);z1=Math.max(z1,c[2])});
   const L=[];for(let z=z0;z<=z1;z++){let s='';for(let x=x0;x<=x1;x++){const v=H.get(x+','+z);s+=v===undefined?'.':String(v%10)}L.push(s)}
   return t+' ('+cells.length+' blocos, '+(x1-x0+1)+'×'+(z1-z0+1)+')\n'+L.join('\n')};
  // duas águas num retângulo 12×8
  const r=mk(P,'roof',{pts:[[0.5,0.5],[11.5,0.5],[11.5,7.5],[0.5,7.5]],sp:1},P.levels[0].id);
  o.push(mapa(voxRoof(P,r),'duas águas 12×8'));
  // quatro águas
  const r2=mk(P,'roof',{pts:[[0.5,0.5],[11.5,0.5],[11.5,7.5],[0.5,7.5]],sp:1,sl:[0,1,2,3]},P.levels[0].id);
  o.push(mapa(voxRoof(P,r2),'quatro águas'));
  // contorno em L
  const r3=mk(P,'roof',{pts:[[0.5,0.5],[11.5,0.5],[11.5,5.5],[5.5,5.5],[5.5,9.5],[0.5,9.5]],sp:1},P.levels[0].id);
  o.push(mapa(voxRoof(P,r3),'contorno em L'));
  o.push('parâmetro ov nos padrões: '+('ov' in DEF.roof)+' · campos: '+SCH.roof.map(f=>f[0]).join(','));
  return o.join('\n\n')}));
 console.log(errs.join('\n')||'sem erros');await b.close()})();
