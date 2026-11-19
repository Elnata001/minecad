const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1360,height:880}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);
 await pg.evaluate(()=>{openP(newProject());P.els=[];B=build(P);cam={x:6,z:5,s:26};render()});
 const bb=await (await pg.$('#c2')).boundingBox();
 const XY=(x,z)=>({x:bb.x+bb.width/2+(x-6)*26,y:bb.y+bb.height/2+(z-5)*26});
 const clk=async(x,z)=>{const q=XY(x,z);await pg.mouse.move(q.x,q.y);await pg.mouse.down();await pg.mouse.up();await pg.waitForTimeout(90)};
 // parede em linha, encadeada como antes
 await pg.click('#tools .tl[data-a="tool:wall"]');await pg.waitForTimeout(200);
 await clk(0.5,0.5);await clk(8.5,0.5);await clk(8.5,6.5);
 await pg.keyboard.press('Escape');await pg.waitForTimeout(150);
 console.log('paredes em linha:',await pg.evaluate(()=>P.els.filter(e=>e.cat==='wall').map(e=>e.x1+','+e.z1+'→'+e.x2+','+e.z2).join(' | ')));
 // piso retângulo
 await pg.click('#tools .tl[data-a="tool:floor"]');await pg.waitForTimeout(200);
 await clk(0.5,0.5);await clk(8.5,6.5);
 console.log('piso:',await pg.evaluate(()=>{const f=P.els.find(e=>e.cat==='floor');return f?'pk='+f.pk+' pts='+JSON.stringify(f.pts)+' · blocos '+[...B.vox.values()].filter(v=>v.o===f.id).length:'nada'}));
 // porta numa parede em linha continua funcionando
 await pg.click('#tools .tl[data-a="tool:door"]');await pg.waitForTimeout(200);
 await clk(4.5,0.5);await pg.waitForTimeout(200);
 console.log('porta:',await pg.evaluate(()=>{const d=P.els.find(e=>e.cat==='door');return d?'host ok pos '+d.pos+' · vãos '+B.rem[d.id]:'não criada'}));
 // atalho por dígito
 await pg.click('#tools .tl[data-a="tool:wall"]');await pg.waitForTimeout(150);
 await pg.keyboard.press('6');await pg.waitForTimeout(150);
 console.log('atalho 6 =',await pg.evaluate(()=>dmet('wall')));
 await pg.keyboard.press('1');await pg.waitForTimeout(150);
 console.log('atalho 1 =',await pg.evaluate(()=>dmet('wall')));
 // projeto de exemplo ainda abre
 console.log('exemplo:',await pg.evaluate(()=>{openP(newProject(true));B=build(P);return P.els.length+' elementos · '+B.vox.size+' blocos'}));
 console.log(errs.join('\n')||' sem erros');await b.close()})();
