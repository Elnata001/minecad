const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1360,height:880},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 await pg.evaluate(()=>{openP(newProject());P.els=[];B=build(P);cam={x:10,z:8,s:16};render()});
 const bb=await (await pg.$('#c2')).boundingBox();
 const XY=(x,z)=>({x:bb.x+bb.width/2+(x-10)*16,y:bb.y+bb.height/2+(z-8)*16});
 const clk=async(x,z)=>{const q=XY(x,z);await pg.mouse.move(q.x,q.y);await pg.mouse.down();await pg.mouse.up();await pg.waitForTimeout(90)};
 const T=()=>pg.evaluate(()=>{const d=[...document.querySelectorAll('.tst')].pop();return d?d.dataset.t:'—'});
 // barra de métodos
 await pg.click('#tools .tl[data-a="tool:wall"]');await pg.waitForTimeout(250);
 console.log('métodos da parede:',await pg.evaluate(()=>[...document.querySelectorAll('#pp .dmb')].map(b2=>b2.title).join(' | ')));
 // círculo
 await pg.evaluate(()=>act('dmet:circle'));await pg.waitForTimeout(150);
 await clk(10.5,8.5);
 await pg.mouse.move(...Object.values(XY(18.5,8.5)));await pg.waitForTimeout(200);
 console.log('cota ao vivo:',await pg.evaluate(()=>drawMeas(RP.concat([cur]),dmet(tool))));
 await pg.screenshot({path:'/tmp/dm1.png',clip:{x:bb.x+bb.width/2-200,y:bb.y+bb.height/2-180,width:420,height:330}});
 await clk(18.5,8.5);
 console.log('parede circular:',await pg.evaluate(()=>{const w=P.els[0];if(!w)return'nada';
  return w.cat+' pk='+w.pk+' pts='+JSON.stringify(w.pts)+' fechado='+w.closed+' · blocos '+[...B.vox.values()].filter(v=>v.o===w.id).length+' · perímetro '+fmt(pathLen(w))}));
 // piso em polígono regular
 await pg.click('#tools .tl[data-a="tool:floor"]');await pg.waitForTimeout(200);
 console.log('métodos do piso:',await pg.evaluate(()=>[...document.querySelectorAll('#pp .dmb')].map(b2=>b2.title).join(' | ')));
 await pg.evaluate(()=>{act('dmet:reg');DREG=6});await pg.waitForTimeout(150);
 await clk(-6.5,8.5);await clk(-0.5,8.5);
 console.log('piso hexagonal:',await pg.evaluate(()=>{const w=P.els[1];return w?w.cat+' pk='+w.pk+' pn='+w.pn+' · blocos '+[...B.vox.values()].filter(v=>v.o===w.id).length+' · área '+geo(w).area:'nada'}));
 // viga em curva
 await pg.click('#tools .tl[data-a="tool:beam"]');await pg.waitForTimeout(200);
 console.log('métodos da viga:',await pg.evaluate(()=>[...document.querySelectorAll('#pp .dmb')].map(b2=>b2.title).join(' | ')));
 await pg.evaluate(()=>act('dmet:bez'));await pg.waitForTimeout(150);
 for(const p of [[-6.5,-4.5],[0.5,-10.5],[8.5,-4.5],[16.5,-10.5]])await clk(...p);
 await pg.keyboard.press('Enter');await pg.waitForTimeout(200);
 console.log('viga curva:',await pg.evaluate(()=>{const w=P.els[2];return w?w.cat+' pk='+w.pk+' pontos '+w.pts.length+' · blocos '+[...B.vox.values()].filter(v=>v.o===w.id).length+' · comprimento '+fmt(pathLen(w)):'nada'}));
 await pg.screenshot({path:'/tmp/dm2.png'});
 console.log(errs.join('\n')||' sem erros');await b.close()})();
