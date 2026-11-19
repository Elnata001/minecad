const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1300,height:900},deviceScaleFactor:1});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 await pg.evaluate(()=>{openP(newProject());P.els=[];B=build(P);render()});
 const bb=await (await pg.$('#c2')).boundingBox();
 const cx=bb.x+bb.width/2,cy=bb.y+bb.height/2;
 const shot=async(t,n)=>{await pg.click(`#tools .tl[data-a="tool:${t}"]`).catch(()=>{});await pg.waitForTimeout(150);
  await pg.mouse.move(cx-160,cy-60);await pg.mouse.down();await pg.mouse.up();await pg.waitForTimeout(100);
  await pg.mouse.move(cx+140,cy+70);await pg.waitForTimeout(250);
  console.log(' ',t,'|',(await pg.textContent('#st')).replace(/\s+/g,' ').slice(0,90));
  await pg.screenshot({path:'/tmp/gh_'+t+'.png',clip:{x:bb.x+bb.width/2-330,y:bb.y+bb.height/2-200,width:620,height:400}});
  await pg.keyboard.press('Escape');await pg.evaluate(()=>{P.els=[];B=build(P);render()});await pg.waitForTimeout(100)};
 for(const t of ['wall','floor','beam','fence','stair','roof'])await shot(t);
 console.log(errs.length?errs.join('\n'):' sem erros');
 await b.close()})();
