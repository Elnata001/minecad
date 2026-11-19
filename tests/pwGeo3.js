const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:700}});
 pg.on('pageerror',e=>console.log('ERRO',e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];const o=[];
  for(const r of[5,7,12])for(const t of[1,2,3]){
   const g=pathPts({k:'circle',pts:[[0.5,0.5],[0.5+r,0.5]]});
   const w=mk(P,'wall',{pts:g.pts,closed:true,h:1,t},P.levels[0].id);
   const c=voxWall(P,w),S=new Set(c.map(q=>q[0]+','+q[2]));
   // espessura radial medida em 8 direções
   const esp=[];for(let k=0;k<8;k++){const a=Math.PI/4*k;let n=0;
    for(let d=0;d<r+6;d+=1){const x=Math.round(0.5+Math.cos(a)*d-0.5),z=Math.round(0.5+Math.sin(a)*d-0.5);if(S.has((x)+','+(z)))n++}
    esp.push(n)}
   o.push('r='+r+' t='+t+': '+c.length+' blocos · perímetro '+fmt(pathLen(w))+' · espessura radial medida '+esp.join(','))}
  // parede em L com espessura 2: sem lacuna no canto
  const w2=mk(P,'wall',{pts:[[0.5,0.5],[8.5,0.5],[8.5,8.5]],h:1,t:2},P.levels[0].id);
  const c2=voxWall(P,w2),S2=new Set(c2.map(q=>q[0]+','+q[2]));
  let mapa='';for(let z=-2;z<=10;z++){let s='';for(let x=-2;x<=11;x++)s+=S2.has(x+','+z)?'#':'.';mapa+=s+'\n'}
  o.push('parede em L, t=2 ('+c2.length+' blocos):\n'+mapa);
  return o.join('\n')}));
 await b.close()})();
