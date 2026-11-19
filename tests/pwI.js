const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1200,height:700},deviceScaleFactor:3});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 await pg.evaluate(()=>cEnter('Componente 8',null));await pg.waitForTimeout(400);
 const r=await pg.evaluate(()=>{const c=document.querySelector('#cfb'),q=s=>[...c.querySelectorAll(s)].map(e=>e.getBoundingClientRect());
  const ins=q('input'),bts=q('button'),lbs=[...c.querySelectorAll('label')];
  return{largura:Math.round(c.getBoundingClientRect().width),altura:Math.round(c.getBoundingClientRect().height),
   baseDosCampos:ins.map(x=>Math.round(x.bottom)),baseDosBotoes:bts.map(x=>Math.round(x.bottom)),
   rotulos:lbs.map(l=>l.firstChild.textContent.trim()+' '+getComputedStyle(l).flexDirection+' '+getComputedStyle(l).fontSize+' '+getComputedStyle(l).color),
   textoInicial:c.textContent.slice(0,12)}});
 console.log('barra:',r.largura+'×'+r.altura,'| texto inicial:',JSON.stringify(r.textoInicial));
 console.log('base dos campos:',r.baseDosCampos.join(','),'| base dos botões:',r.baseDosBotoes.join(','),
   '->',r.baseDosCampos.every(v=>r.baseDosBotoes.every(w=>Math.abs(v-w)<=1))?'alinhados':'DESALINHADOS');
 r.rotulos.forEach(x=>console.log('  rótulo:',x));
 const cfb=await pg.$('#cfb');await cfb.screenshot({path:'/tmp/sH.png'});
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
