const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 const XY=async(x,z)=>pg.evaluate(([x,z])=>{const r=c2.getBoundingClientRect();return[r.left+(x-cam.x)*cam.s+c2.clientWidth/2,r.top+(z-cam.z)*cam.s+c2.clientHeight/2]},[x,z]);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];view='plan';lv=P.levels[0].id;cam.s=12;cam.x=20;cam.z=16;
  tool='topo';DMETS.topo='rect';render();
  // 1. desenhar o perímetro com o método retângulo
  toolClick([0.5,0.5],[0.5,0.5],{});toolClick([40.5,32.5],[40.5,32.5],{});
  const t=P.els[0];
  return '1. terreno criado: '+(t&&t.cat)+' · perímetro '+(t&&t.pts.length)+' pontos · método '+t.pk+' · listas '+JSON.stringify([t.tp.length,t.bl.length,t.pad.length])}));
 console.log(await pg.evaluate(()=>{const t=P.els[0],o=[];
  // 2. pontos cotados
  tool='tpt';
  const P4=[[5,5,0],[36,5,6],[36,28,14],[5,28,8],[20,16,18]];
  for(const p of P4){DEF.tpt.z=p[2];topoPt([p[0],p[1]])}
  o.push('2. pontos: '+t.tp.length+' · malha '+tinOf(t).T.length+' triângulos · cotas '+fmt(tinOf(t).zmin)+'→'+fmt(tinOf(t).zmax));
  // 3. plataforma
  tool='pad';DEF.pad.z=10;
  topoAdd('pad',{pts:[[14,10],[26,22]],pk:'rect',closed:true});
  o.push('3. plataforma: '+t.pad.length+' · cota no centro (projetado) '+fmt(tinZ(tinOf(t,true),20,16))+' · original '+fmt(tinZ(tinOf(t,false),20,16)));
  // 4. linha de ruptura
  tool='tbl';DEF.tbl.z=4;
  topoAdd('tbl',{pts:[[2,30],[38,30]],pk:'line',closed:false});
  o.push('4. linha de ruptura: '+t.bl.length+' · cota em (20,30) '+fmt(tinZ(tinOf(t),20,30)));
  // 5. seleção pelo perímetro
  o.push('5. pick2 no meio do terreno: '+(pick2([30,8])===t.id)+' · fora: '+pick2([80,80]));
  o.push('   envoltória: '+JSON.stringify(B.bb[t.id]));
  // 6. propriedades
  const q=tinOf(t);
  o.push('6. área plana '+fmt(q.ap)+' · área 3D '+fmt(q.a3)+' · desnível '+fmt(q.zmax-q.zmin)+' · incl. média '+fmt(q.sl)+'° · máx '+fmt(q.slmax)+'°');
  sel=t.id;SELS=[t.id];tool='sel';render();
  return o.join('\n')}));
 await pg.waitForTimeout(400);
 await pg.screenshot({path:'/tmp/topo_plan.png',clip:{x:70,y:150,width:900,height:640}});
 console.log(errs.join('\n')||'sem erros');await b.close()})();
