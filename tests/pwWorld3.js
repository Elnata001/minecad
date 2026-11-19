const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1400,height:900},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 // aba CSV continua funcionando
 fs.writeFileSync('/tmp/w/pontos.csv','x;y;cota\n0;0;10\n20;0;14\n20;20;9\n0;20;12\n10;10;16\n');
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];dlgTopoImp();
  return 'aba inicial: '+TIMPT+' · título: '+document.querySelector('#dlg h3').textContent}));
 await pg.setInputFiles('#tif','/tmp/w/pontos.csv');
 await pg.evaluate(()=>tImpRead());await pg.waitForTimeout(300);
 console.log(await pg.evaluate(()=>{const p=tImpPts();tImpGo();if(TPEND)topoPlaceAt([TPEND.ox,TPEND.oz]);
  const t=P.els.find(e=>e.cat==='topo'),q=tinOf(t);
  return 'CSV: '+p.length+' pontos lidos · terreno com '+t.tp.length+' pontos e '+q.T.length+' triângulos'}));
 // aba do mundo
 await pg.evaluate(()=>{openP(newProject());P.els=[];dlgTopoImp();TIMPT='world';dlgTopoImp()});
 await pg.setInputFiles('#wif','/tmp/w/r.0.0.mca');
 await pg.evaluate(()=>wImpRead());await pg.waitForTimeout(400);
 await pg.evaluate(async()=>{WSEL={x0:0,z0:0,x1:95,z1:95};await wImpScan()});
 await pg.waitForTimeout(400);
 const d=await pg.$('#dlg');await d.screenshot({path:'/tmp/wimp_dlg.png'});
 console.log(await pg.evaluate(()=>'prévia: '+document.querySelector('#wiprev').innerText.replace(/\n+/g,' | ')));
 // arquivo inválido
 fs.writeFileSync('/tmp/w/lixo.nbt','isto não é nbt');
 await pg.setInputFiles('#wif','/tmp/w/lixo.nbt');
 console.log(await pg.evaluate(async()=>{await wImpRead();return 'arquivo inválido: '+(WIMP?'ERRO aceitou':'recusado com aviso')}));
 console.log(errs.length?errs.join('\n'):'SEM ERROS');
 await b.close()})();
