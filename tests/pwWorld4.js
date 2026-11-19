const {chromium}=require('playwright'),fs=require('fs');
const GH=(x,z)=>Math.round(64+8*Math.sin(x/19)+6*Math.cos(z/13)+3*Math.sin((x+z)/7));
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1400,height:900}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 await pg.evaluate(()=>{openP(newProject());P.els=[];dlgTopoImp();TIMPT='world';dlgTopoImp()});
 await pg.setInputFiles('#wif',['/tmp/w/r.0.0.mca','/tmp/w/r.0.0b.mca']);
 await pg.evaluate(()=>wImpRead());await pg.waitForTimeout(600);
 console.log(await pg.evaluate(()=>'1) dois arquivos: '+WIMP.name+' · '+WIMP.n+' chunks · X '+WIMP.x0+'…'+WIMP.x1+' · Z '+WIMP.z0+'…'+WIMP.z1));
 console.log(await pg.evaluate(async()=>{WSEL={x0:100,z0:20,x1:179,z1:99};WOPT.tol=1;
  await wImpScan();const F=WPRE.F,at=(x,z)=>F.g[(z-F.z0)*F.w+(x-F.x0)];
  return '2) recorte atravessando os dois: '+F.n+' colunas · '+WPRE.V.length+' pontos'
   +'\n   antes da emenda (120,50)='+at(120,50)+' · depois (140,50)='+at(140,50)+' · bem na emenda (128,50)='+at(128,50)}));
 console.log('   esperado pela fórmula: '+[[120,50],[140,50],[128,50]].map(([x,z])=>GH(x,z)+1).join(' · '));
 console.log(await pg.evaluate(()=>{wImpGo();if(TPEND)topoPlaceAt([TPEND.ox,TPEND.oz]);const t=P.els.find(e=>e.cat==='topo'),q=tinOf(t);
  return '3) terreno: '+t.tp.length+' pontos · '+q.T.length+' triângulos · cotas '+fmt(q.zmin)+' a '+fmt(q.zmax)}));
 console.log(errs.length?errs.join('\n'):'SEM ERROS');
 await b.close()})();
