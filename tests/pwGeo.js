const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:700}});
 pg.on('pageerror',e=>console.log('ERRO',e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 const r=await pg.evaluate(()=>{const o=[];
  const mapa=(Q,ttl)=>{let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;Q.forEach(([x,z])=>{x0=Math.min(x0,x);x1=Math.max(x1,x);z0=Math.min(z0,z);z1=Math.max(z1,z)});
   const S=new Set(Q.map(q=>q[0]+','+q[1])),L=[];
   for(let z=z0;z<=z1;z++){let s='';for(let x=x0;x<=x1;x++)s+=S.has(x+','+z)?'#':'.';L.push(s)}
   return ttl+' ('+Q.length+' vértices)\n'+L.join('\n')};
  let p=pathPts({k:'circle',pts:[[0.5,0.5],[8.5,0.5]]});o.push(mapa(p.pts,'círculo r=8'));
  p=pathPts({k:'circle',pts:[[0.5,0.5]],c:[0.5,0.5],r:4});o.push(mapa(p.pts,'círculo r=4'));
  p=pathPts({k:'rect',pts:[[0.5,0.5],[6.5,4.5]]});o.push('retângulo: '+JSON.stringify(p.pts)+' fechado '+p.closed);
  p=pathPts({k:'reg',pts:[[0.5,0.5],[6.5,0.5]],n:6});o.push(mapa(p.pts,'hexágono r=6'));
  p=pathPts({k:'arc',pts:[[0.5,0.5],[12.5,0.5],[6.5,6.5]]});o.push(mapa(p.pts,'arco por 3 pontos'));
  p=pathPts({k:'bez',pts:[[0.5,0.5],[6.5,8.5],[12.5,0.5],[18.5,8.5]]});o.push(mapa(p.pts,'curva por pontos'));
  p=pathPts({k:'bez',pts:[[0.5,0.5],[8.5,2.5],[6.5,10.5],[-2.5,8.5]],closed:true});o.push(mapa(p.pts,'curva fechada'));
  return o.join('\n\n')});
 console.log(r);await b.close()})();
