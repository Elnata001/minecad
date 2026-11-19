const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1360,height:880}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);
 await pg.evaluate(()=>{openP(newProject());P.els=[];B=build(P);cam={x:8,z:6,s:26};tool='stair';RP=[];DEF.stair.top='';render()});
 const T=()=>pg.evaluate(()=>{const d=[...document.querySelectorAll('.tst')].pop();return d?(d.classList.contains('err')?'ERRO: ':'ok: ')+d.dataset.t:'—'});
 const bb=await (await pg.$('#c2')).boundingBox();
 const XY=(x,z)=>({x:bb.x+bb.width/2+(x-8)*26,y:bb.y+bb.height/2+(z-6)*26});
 const clk=async(x,z)=>{const q=XY(x,z);await pg.mouse.move(q.x,q.y);await pg.mouse.down();await pg.mouse.up();await pg.waitForTimeout(110)};
 // 1. espaço troca o lado
 console.log('1. espaço:',await pg.evaluate(()=>DEF.stair.sd));
 await pg.keyboard.press(' ');await pg.waitForTimeout(120);
 console.log('   após espaço:',await pg.evaluate(()=>DEF.stair.sd),'|',await T());
 await pg.keyboard.press(' ');await pg.keyboard.press(' ');await pg.waitForTimeout(120);
 console.log('   ciclo completo:',await pg.evaluate(()=>DEF.stair.sd));
 // 2. partes independentes
 await clk(0.5,0.5);await clk(4.5,0.5);
 console.log('2. parte 1 fechada: pontos',await pg.evaluate(()=>RP.length));
 await clk(10.5,6.5);await clk(14.5,6.5);
 console.log('   parte 2 longe da 1ª: pontos',await pg.evaluate(()=>RP.length),'|',await pg.evaluate(()=>stairHint().replace(/<[^>]+>/g,' ')));
 await pg.screenshot({path:'/tmp/es3.png',clip:{x:bb.x,y:bb.y,width:700,height:420}});
 await pg.click('#pp button[data-a="stdone"]');await pg.waitForTimeout(250);
 console.log('3. concluído:',await T());
 console.log('   elemento:',await pg.evaluate(()=>{const e=P.els.filter(x=>x.cat==='stair');if(e.length!==1)return e.length+' elementos';
  const p=stairPlan(P,e[0]);const por=new Map();p.cells.forEach(c=>{const k=c[0]+','+c[2];if(!por.has(k)||por.get(k)[1]<c[1])por.set(k,c)});
  return '1 elemento · partes '+p.parts+' · degraus '+p.N+' · patamares '+p.lands+' · cotas por X,Z: '+[...por.entries()].sort().map(([k,c])=>k+'→'+c[1]).join(' ')}));
 console.log(errs.join('\n')||' sem erros');await b.close()})();
