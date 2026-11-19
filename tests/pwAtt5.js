const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1340,height:820},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 await pg.evaluate(()=>{openP(newProject());P.els=[];
  const a=P.levels[0].id,b2=P.levels[1].id;
  const w=mkWall(P,[0.5,0.5],[0.5,7.5],a);w.h=4;w.top=null;P.els.push(w);
  P.els.push(mk(P,'roof',{pts:[[0.5,0.5],[11.5,0.5],[11.5,7.5],[0.5,7.5]],sp:1,base:b2,off:0},b2));
  B=build(P);sel=w.id;SELS=[sel];tool='sel';lv=P.levels[1].id;cam={x:6,z:4,s:30};render()});
 await pg.waitForTimeout(350);
 const toasts=()=>pg.evaluate(()=>[...document.querySelectorAll('.tst')].map(d=>(d.classList.contains('err')?'ERRO: ':'ok: ')+d.dataset.t));
 const bb=await (await pg.$('#c2')).boundingBox();
 const XY=(x,z)=>({x:bb.x+bb.width/2+(x-6)*30,y:bb.y+bb.height/2+(z-4)*30});
 await pg.evaluate(()=>{const b2=document.querySelector('#fb [data-a="attach"]');b2.click()});
 await pg.waitForTimeout(350);
 console.log('1. avisos ao clicar:',JSON.stringify(await toasts()));
 console.log('   botão:',await pg.evaluate(()=>{const b2=document.querySelector('#fb .fbx');return b2?b2.className+' (verde: '+(getComputedStyle(b2).backgroundColor!=='rgba(0, 0, 0, 0)'&&getComputedStyle(b2).backgroundColor.includes('79')?'sim':'não')+')':'sumiu'}));
 // passa o cursor sobre a cobertura
 {const q=XY(6.5,4.5);await pg.mouse.move(q.x,q.y);await pg.waitForTimeout(250)}
 console.log('2. destaque sob o cursor:',await pg.evaluate(()=>EHOV===P.els[1].id?'cobertura marcada':'EHOV='+EHOV));
 await pg.screenshot({path:'/tmp/at2.png',clip:{x:bb.x,y:bb.y,width:700,height:400}});
 // clica
 await pg.mouse.down();await pg.mouse.up();await pg.waitForTimeout(350);
 console.log('3. após clicar:',(await toasts()).slice(-1)[0],'| vínculo:',await pg.evaluate(()=>P.els[0].att===P.els[1].id),'| blocos:',await pg.evaluate(()=>[...B.vox.values()].filter(v=>v.o===P.els[0].id).length));
 console.log('   modo encerrado:',await pg.evaluate(()=>!ATTP),'| botão agora:',await pg.evaluate(()=>{const b2=document.querySelector('#fb .fbx');return b2?b2.title+' · classes '+b2.className:'sumiu'}));
 await pg.screenshot({path:'/tmp/at3.png',clip:{x:bb.x,y:bb.y,width:700,height:400}});
 console.log(errs.join('\n')||'sem erros');await b.close()})();
