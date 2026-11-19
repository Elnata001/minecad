const {chromium}=require('playwright'),fs=require('fs');
const GH=(x,z)=>Math.round(64+8*Math.sin(x/19)+6*Math.cos(z/13)+3*Math.sin((x+z)/7));
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1400,height:900},deviceScaleFactor:1});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 await pg.evaluate(()=>{openP(newProject());P.els=[];dlgTopoImp();TIMPT='world';dlgTopoImp()});

 // ---- 1. região .mca ----
 await pg.setInputFiles('#wif','/tmp/w/r.0.0.mca');
 await pg.evaluate(()=>wImpRead());await pg.waitForTimeout(400);
 console.log(await pg.evaluate(()=>'1) região lida: '+WIMP.kind+' · '+WIMP.n+' chunks · X '+WIMP.x0+'…'+WIMP.x1+' · Z '+WIMP.z0+'…'+WIMP.z1
  +'\n   recorte padrão: '+JSON.stringify(WSEL)));
 console.log(await pg.evaluate(async()=>{WSEL={x0:0,z0:0,x1:63,z1:63};WOPT.tol=.5;WOPT.nat=true;
  const t0=performance.now();await wImpScan();const ms=Math.round(performance.now()-t0);
  const F=WPRE.F,at=(x,z)=>F.g[(z-F.z0)*F.w+(x-F.x0)];
  return '2) varredura 64×64: '+F.n+' colunas em '+ms+' ms · '+WPRE.V.length+' pontos · erro máx '+WPRE.err.toFixed(2)
   +'\n   cota em (10,10)='+at(10,10)+' · (33,41)='+at(33,41)+' · (50,7)='+at(50,7)}));
 console.log(await pg.evaluate(()=>{const F=WPRE.F,at=(x,z)=>F.g[(z-F.z0)*F.w+(x-F.x0)];
  const q=tinQuick(WPRE.V);let bad=0,mx=0,n=0;
  for(let z=F.z0;z<F.z0+F.h;z++)for(let x=F.x0;x<F.x0+F.w;x++){const y=at(x,z);if(!(y===y))continue;n++;
   const e=tinZ(q,x+.5,z+.5);if(e===null){bad++;continue}const d=Math.abs(e-y);if(d>mx)mx=d;if(d>WOPT.tol+1e-6)bad++}
  return '3) a malha reproduz o campo: '+n+' colunas conferidas · fora da tolerância: '+bad+' · erro máx '+mx.toFixed(2)}));
 console.log('   conferência contra a fórmula do gerador: '+await pg.evaluate(()=>{const F=WPRE.F,at=(x,z)=>F.g[(z-F.z0)*F.w+(x-F.x0)];
  return JSON.stringify([[10,10,at(10,10)],[33,41,at(33,41)],[50,7,at(50,7)],[5,60,at(5,60)]])}));

 // ---- 4. filtro de vegetação e construção ----
 console.log(await pg.evaluate(async()=>{const o=[];
  WSEL={x0:16,z0:16,x1:47,z1:47};
  WOPT.nat=true;await wImpScan();const a=WPRE.F,ha=(x,z)=>a.g[(z-a.z0)*a.w+(x-a.x0)];
  const na=[...a.hist.keys()].sort().join(', ');
  WOPT.nat=false;await wImpScan();const c=WPRE.F,hc=(x,z)=>c.g[(z-c.z0)*c.w+(x-c.x0)];
  const nc=[...c.hist.keys()].sort().join(', ');
  o.push('4) só terreno natural → superfícies: '+na);
  o.push('   como está → superfícies: '+nc);
  o.push('   sobre a casa (24,24): natural '+ha(24,24)+' · como está '+hc(24,24)+' (diferença '+(hc(24,24)-ha(24,24))+')');
  WOPT.nat=true;return o.join('\n')}));

 // ---- 5. água ----
 console.log(await pg.evaluate(async()=>{WSEL={x0:80,z0:30,x1:99,z1:49};
  WOPT.water='floor';await wImpScan();const f=WPRE.F,hf=(x,z)=>f.g[(z-f.z0)*f.w+(x-f.x0)];
  WOPT.water='top';await wImpScan();const t=WPRE.F,ht=(x,z)=>t.g[(z-t.z0)*t.w+(x-t.x0)];
  WOPT.water='floor';
  return '5) no lago (90,40): fundo '+hf(90,40)+' · superfície da água '+ht(90,40)}));

 // ---- 6. fidelidade ----
 console.log(await pg.evaluate(async()=>{WSEL={x0:0,z0:0,x1:63,z1:63};const o=[];
  for(const t of [2,1,.5,.25]){WOPT.tol=t;const t0=performance.now();await wImpScan();
   o.push('   ± '+t+' bloco → '+WPRE.V.length+' pontos, erro '+WPRE.err.toFixed(2)+', '+Math.round(performance.now()-t0)+' ms')}
  WOPT.tol=.5;await wImpScan();return '6) fidelidade:\n'+o.join('\n')}));

 // ---- 7. criar o terreno ----
 console.log(await pg.evaluate(()=>{WSEL={x0:0,z0:0,x1:63,z1:63};WOPT.org='zero';wImpGo();if(TPEND)topoPlaceAt([TPEND.ox,TPEND.oz]);
  const t=P.els.find(e=>e.cat==='topo'),q=tinOf(t),ty=typeOf(P,t.ty);
  const F=WPRE.F,at=(x,z)=>F.g[(z-F.z0)*F.w+(x-F.x0)];
  let mx=0;for(let z=2;z<62;z+=3)for(let x=2;x<62;x+=3){const y=at(x,z),e=tinZ(q,x+.5,z+.5);
   if(y===y&&e!==null)mx=Math.max(mx,Math.abs((e)-(y-Math.round(Math.min.apply(null,WPRE.V.map(v=>v[2]))))))}
  return '7) terreno criado: '+t.name+'\n   pontos '+t.tp.length+' · triângulos '+q.T.length+' · cotas '+fmt(q.zmin)+' a '+fmt(q.zmax)
   +'\n   tipo criado: '+ty.name+' · camadas '+JSON.stringify(ty.ly)
   +'\n   perímetro: '+JSON.stringify(t.pts)}));

 // ---- 8. estrutura e esquema ----
 await pg.setInputFiles('#wif','/tmp/w/casa.nbt');
 await pg.evaluate(()=>wImpRead());await pg.waitForTimeout(300);
 console.log(await pg.evaluate(async()=>{await wImpScan();
  const F=WPRE.F,at=(x,z)=>F.g[(z-F.z0)*F.w+(x-F.x0)];
  return '8) estrutura .nbt: '+WIMP.kind+' '+WIMP.W+'×'+WIMP.H+'×'+WIMP.L+' · X '+WIMP.x0+'…'+WIMP.x1
   +'\n   '+F.n+' colunas · '+WPRE.V.length+' pontos · cota em (10,10)='+at(10,10)}));
 await pg.setInputFiles('#wif','/tmp/w/recorte.schem');
 await pg.evaluate(()=>wImpRead());await pg.waitForTimeout(300);
 console.log(await pg.evaluate(async()=>{await wImpScan();
  const F=WPRE.F,at=(x,z)=>F.g[(z-F.z0)*F.w+(x-F.x0)];
  return '9) esquema .schem: '+WIMP.W+'×'+WIMP.H+'×'+WIMP.L+' · X '+WIMP.x0+'…'+WIMP.x1+' · Z '+WIMP.z0+'…'+WIMP.z1
   +'\n   '+F.n+' colunas · '+WPRE.V.length+' pontos · cota em (50,20)='+at(50,20)}));
 console.log(errs.length?errs.join('\n'):'SEM ERROS');
 await b.close()})();
