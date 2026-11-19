const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1360,height:880}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];const o=[];
  const mapa=(c,t)=>{let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;const S=new Set();
   c.forEach(q=>{S.add(q[0]+','+q[2]);x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);z0=Math.min(z0,q[2]);z1=Math.max(z1,q[2])});
   const L=[];for(let z=z0;z<=z1;z++){let s='';for(let x=x0;x<=x1;x++)s+=S.has(x+','+z)?'#':'.';L.push(s)}
   return t+'\n'+L.join('\n')};
  for(const cs of['rect','circle','diam']){const c=mk(P,'column',{x1:0.5,z1:0.5,cs,sx:7,sz:7,h:1},P.levels[0].id);
   o.push(mapa(voxColumn(P,c),'pilar '+cs+' 7×7 ('+voxColumn(P,c).length+' blocos/camada)'))}
  return o.join('\n\n')}));
 // editar forma numa parede em caminho
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];
  const w=mk(P,'wall',{pts:[[0.5,0.5],[8.5,0.5]],pk:'circle',closed:true,h:3},P.levels[0].id);P.els.push(w);B=build(P);sel=w.id;
  act('sk');const n=SK?SK.P.length+'v/'+SK.E.length+'a · '+skStatus():'não abriu';
  act('skok');const e=P.els[0];
  return 'círculo -> editar forma: '+n+' | após concluir pk='+e.pk+' pontos='+e.pts.length+' fechado='+e.closed}));
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];
  const w=mkWall(P,[0.5,0.5],[10.5,0.5],P.levels[0].id);P.els.push(w);B=build(P);sel=w.id;
  act('sk');const st=SK?skStatus():'não abriu';
  // acrescenta um vértice e conclui como traçado aberto
  const r=[];r.push('parede reta -> '+st);
  act('tool:split');cur=[5.5,0.5];skDown([5.5,0.5]);
  SK.P[SK.sv]=[5.5,4.5];skWeld();
  r.push('após repartir e puxar: '+skStatus());
  act('skok');const e=P.els[0];
  r.push('resultado: pk='+e.pk+' pts='+JSON.stringify(e.pts)+' fechado='+e.closed+' · blocos '+CATS.wall.vox(P,e).length);
  return r.join('\n')}));
 console.log(errs.join('\n')||' sem erros');await b.close()})();
