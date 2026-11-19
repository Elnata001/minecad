const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:700}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];
  const a=P.levels[0].id,b2=P.levels[1].id;
  // parede de empena: corre no eixo Z, sob o caimento da cobertura de duas águas
  const w=mkWall(P,[0.5,0.5],[0.5,7.5],a);w.h=4;w.top=null;P.els.push(w);
  const r=mk(P,'roof',{pts:[[0.5,0.5],[11.5,0.5],[11.5,7.5],[0.5,7.5]],sp:1,base:b2,off:0},b2);P.els.push(r);
  B=build(P);
  const perfil=e=>{const H=new Map();[...B.vox.values()].filter(v=>v.o===e).forEach(v=>{if(!H.has(v.z)||H.get(v.z)<v.y)H.set(v.z,v.y)});
   return[...H.entries()].sort((x,y)=>x[0]-y[0]).map(([z,y])=>y).join(',')};
  const o=[];
  o.push('parede livre: '+[...B.vox.values()].filter(v=>v.o===w.id).length+' blocos · topo por Z: '+perfil(w.id));
  mutate(()=>{w.att=r.id});
  o.push('anexada: '+[...B.vox.values()].filter(v=>v.o===w.id).length+' blocos · topo por Z: '+perfil(w.id));
  o.push('base da cobertura por Z: '+(()=>{const H=new Map();[...B.vox.values()].filter(v=>v.o===r.id&&v.x===0).forEach(v=>{if(!H.has(v.z)||H.get(v.z)>v.y)H.set(v.z,v.y)});return[...H.entries()].sort((x,y)=>x[0]-y[0]).map(([z,y])=>y).join(',')})());
  mutate(()=>{P.els[1].sp=2});
  o.push('inclinação 2: '+[...B.vox.values()].filter(v=>v.o===w.id).length+' blocos · topo por Z: '+perfil(w.id));
  mutate(()=>{P.els[1].sp=1});
  // parede espessa de 2 camadas
  mutate(()=>{w.t=2;w.ty=P.types.wall[2].id});syncT(P);B=build(P);
  o.push('duas camadas: '+[...B.vox.values()].filter(v=>v.o===w.id).length+' blocos · materiais '+[...new Set([...B.vox.values()].filter(v=>v.o===w.id).map(v=>v.m))].join('+'));
  return o.join('\n')}));
 console.log(errs.join('\n')||'sem erros');await b.close()})();
