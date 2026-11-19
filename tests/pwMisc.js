const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1360,height:880},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 await pg.evaluate(()=>{openP(newProject());P.els=[];B=build(P);cam={x:5,z:4,s:38};render()});
 const toasts=()=>pg.evaluate(()=>[...document.querySelectorAll('.tst')].map(d=>(d.classList.contains('err')?'ERRO: ':'ok: ')+d.dataset.t));
 // 4. rótulo do desenho
 console.log('4. piso 11×10:',await pg.evaluate(()=>{tool='floor';pts=[0.5,0.5];cur=[10.5,9.5];return drawLab(pts,cur)}));
 console.log('   cobertura 6×4:',await pg.evaluate(()=>{tool='roof';pts=[0.5,0.5];cur=[5.5,3.5];return drawLab(pts,cur)}));
 console.log('   parede reta:',await pg.evaluate(()=>{tool='wall';pts=[0.5,0.5];cur=[9.5,0.5];return drawLab(pts,cur)}));
 console.log('   parede diagonal:',await pg.evaluate(()=>{tool='wall';pts=[0.5,0.5];cur=[6.5,4.5];return drawLab(pts,cur)}));
 // 3. janela de 1 bloco pela interface
 await pg.evaluate(()=>{openP(newProject());P.els=[];P.els.push(mkWall(P,[0.5,4.5],[10.5,4.5],P.levels[0].id));B=build(P);tool='sel';render()});
 await pg.click('#tools .tl[data-a="tool:window"]');await pg.waitForTimeout(250);
 const bb=await (await pg.$('#c2')).boundingBox();
 const XY=(x,z)=>({x:bb.x+bb.width/2+(x-5)*38,y:bb.y+bb.height/2+(z-4)*38});
 {const q=XY(4.5,4.5);await pg.mouse.move(q.x,q.y);await pg.mouse.down();await pg.mouse.up();await pg.waitForTimeout(150);
  await pg.mouse.down();await pg.mouse.up();await pg.waitForTimeout(250)}
 console.log('3. janela por 2 cliques na mesma célula:',await pg.evaluate(()=>{const j=P.els.find(e=>e.cat==='window');
  if(!j)return'não criada';const c=[...B.vox.values()].filter(v=>v.o===j.id);
  return c.length+' blocos em X '+[...new Set(c.map(v=>v.x))].join(',')+' Y '+[...new Set(c.map(v=>v.y))].join(',')}));
 // 2. erro comum vira pop-up
 await pg.evaluate(()=>{tool='trim';render()});
 await pg.evaluate(()=>{editClick([30,30],[30.5,30.5]);render()});await pg.waitForTimeout(200);
 console.log('2. erro da ferramenta Aparar:',(await toasts()).slice(-1)[0]);
 await pg.evaluate(()=>{tool='sel';sel=null;act('rotgo')});await pg.waitForTimeout(200);
 console.log('   erro sem seleção:',(await toasts()).slice(-1)[0]);
 await pg.screenshot({path:'/tmp/ms1.png'});
 console.log(errs.join('\n')||' sem erros');await b.close()})();
