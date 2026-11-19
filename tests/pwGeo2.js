const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:700}});
 pg.on('pageerror',e=>console.log('ERRO',e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];const o=[];
  const mapa=(cells,ttl)=>{let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;const S=new Set();
   cells.forEach(c=>{S.add(c[0]+','+c[2]);x0=Math.min(x0,c[0]);x1=Math.max(x1,c[0]);z0=Math.min(z0,c[2]);z1=Math.max(z1,c[2])});
   const L=[];for(let z=z0;z<=z1;z++){let s='';for(let x=x0;x<=x1;x++)s+=S.has(x+','+z)?'#':'.';L.push(s)}
   return ttl+'\n'+L.join('\n')};
  // parede circular de 1 e 2 blocos de espessura
  let g=pathPts({k:'circle',pts:[[0.5,0.5],[7.5,0.5]]});
  let w=mk(P,'wall',{pts:g.pts,closed:true,h:1},P.levels[0].id);
  o.push(mapa(voxWall(P,w),'parede circular r=7, t=1 ('+voxWall(P,w).length+' blocos, perímetro '+fmt(pathLen(w))+')'));
  w.t=2;o.push(mapa(voxWall(P,w),'mesma parede com t=2'));
  // piso circular
  const f=mk(P,'floor',{pts:g.pts},P.levels[0].id);
  o.push('piso circular: '+voxFloor(P,f).length+' blocos (área de um círculo r=7 ≈ '+Math.round(Math.PI*49)+')');
  // viga curva
  const cv=pathPts({k:'bez',pts:[[0.5,0.5],[6.5,6.5],[12.5,0.5]]});
  const bm=mk(P,'beam',{pts:cv.pts,bw:1,bh:1},P.levels[0].id);
  o.push(mapa(CATS.beam.vox(P,bm),'viga em curva ('+CATS.beam.vox(P,bm).length+' blocos)'));
  return o.join('\n\n')}));
 await b.close()})();
