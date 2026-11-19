const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:700}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];
  const b2=P.levels[1].id,o=[];
  const r=mk(P,'roof',{pts:[[0.5,0.5],[11.5,0.5],[11.5,7.5],[0.5,7.5]],sp:1,base:b2,off:0},b2);P.els.push(r);
  const ty=typeOf(P,r.ty);B=build(P);
  // mapa: coluna -> celulas ordenadas por Y
  const cols=()=>{const c=voxRoof(P,r),m=new Map();c.forEach(q=>{const k=q[0]+','+q[2];(m.get(k)||m.set(k,[]).get(k)).push(q)});
   m.forEach(v=>v.sort((a,c2)=>a[1]-c2[1]));return m};
  const lin=m=>[...m.entries()].filter(([k])=>k.split(',')[0]==='3').sort((a,c)=>+a[0].split(',')[1]-+c[0].split(',')[1])
   .map(([k,v])=>'z'+k.split(',')[1]+': '+v.map(q=>'y'+q[1]+' '+(q[4]||'?')+(q[3]?'('+q[3].facing+'/'+q[3].half+')':q[6]?'('+q[6]+')':'')).join(' | ')).join('\n  ');
  for(const un of ['stair','slab','full']){mutate(()=>{ty.under=un});const m=cols();
   // contagem de apoios por tipo de coluna
   const D=new Map();voxRoof(P,r);
   let ap=0,beiral=0,cume=0;
   m.forEach((v,k)=>{const sup=v.length>1&&v[0][4]&&v.slice(1).some(q=>q[4]===v[v.length-1][4])?0:0;});
   o.push('--- apoio: '+un+' ---\n  '+lin(m))}
  // checagens automaticas
  mutate(()=>{ty.under='stair'});
  const m=cols(),cell=voxRoof(P,r);
  const prof=new Map(),{D,set}=roofCells(r);set.forEach(k=>prof.set(k,D.get(k)));
  let errB=0,errC=0,nap=0;
  m.forEach((v,k)=>{const d=prof.get(k),topY=Math.max(...v.map(q=>q[1])),minY=Math.min(...v.map(q=>q[1]));
   const hasSup=v.some(q=>q[1]===minY&&q[3]&&q[3].half==='top');
   if(hasSup)nap++;
   if(hasSup&&d===0)errB++;
   const isCume=cell.some(q=>q[0]+','+q[2]===k&&q[4]===ty.ridge&&!q[3]);
   if(hasSup&&isCume)errC++});
  o.push('escada invertida -> apoios: '+nap+' | sob a 1a fiada: '+errB+' | sob a cumeeira: '+errC);
  mutate(()=>{ty.under='slab'});
  const m2=cols();let nap2=0,errB2=0,cume2=0;
  m2.forEach((v,k)=>{const d=prof.get(k),minY=Math.min(...v.map(q=>q[1])),
   hasSup=v.some(q=>q[1]===minY&&q[6]==='top'&&q[4]===asKind(ty.block,'b'));
   if(hasSup){nap2++;if(d===0)errB2++;if(voxRoof(P,r).some(q=>q[0]+','+q[2]===k&&q[4]===ty.ridge&&!q[3]))cume2++}});
  o.push('laje -> apoios: '+nap2+' | sob a 1a fiada: '+errB2+' | sob a cumeeira (permitido): '+cume2);
  return o.join('\n')}));
 console.log(errs.join('\n')||'sem erros');await b.close()})();
