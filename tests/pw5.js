const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1440,height:900}});
 const errs=[];pg.on('pageerror',e=>errs.push('PAGEERROR '+e.message+' @ '+String(e.stack||'').split('\n')[1]));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(1500);
 await pg.evaluate(()=>{openP(newProject());P.els=[];B=build(P);o.t.set(8,0,8);o.r=30;o.th=.9;o.ph=1;setView('3d')});
 const bb=await (await pg.$('#v3')).boundingBox(),CX=bb.x+bb.width/2,CY=bb.y+bb.height/2;
 // parede no 3D
 await pg.click('[data-a="tool:wall"]');await pg.evaluate(()=>{DEF.wall.off=0;render()});
 await pg.mouse.click(CX-150,CY+60);await pg.waitForTimeout(350);await pg.mouse.click(CX+150,CY+60);await pg.waitForTimeout(450);await pg.keyboard.press('Escape');
 await pg.click('[data-a="tool:sel"]');
 const wid=await pg.evaluate(()=>{const w=P.els.find(e=>e.cat==='wall');return w?w.id:null});
 if(!wid){console.log('parede NÃO criada pelos cliques no 3D');await b.close();process.exit(1)}
 await pg.evaluate(([id])=>{sel=id;SELS=[id];render()},[wid]);
 console.log('alças:',await pg.evaluate(()=>HM.map(m=>[m.position.x,m.position.y,m.position.z].join(',')).join(' | ')));
 const b0=await pg.evaluate(()=>{const w=P.els.find(e=>e.cat==='wall');return[w.x2,w.z2].join(',')});
 // arrasta a alça final (índice 1)
 await pg.evaluate(()=>{window.__HIT3=[{object:{userData:{i:1}}}]});
 await pg.mouse.move(CX+150,CY+60);await pg.mouse.down();
 await pg.evaluate(()=>{window.__HIT3=null});
 await pg.mouse.move(CX+150,CY-40,{steps:8});await pg.mouse.up();await pg.waitForTimeout(250);
 const b1=await pg.evaluate(()=>{const w=P.els.find(e=>e.cat==='wall');return[w.x2,w.z2].join(',')});
 console.log('alça arrastada: fim de',b0,'para',b1,'| mudou:',b0!==b1?'sim':'NÃO');
 await pg.keyboard.press('Control+z');await pg.waitForTimeout(200);
 console.log('desfazer -> fim:',await pg.evaluate(()=>{const w=P.els.find(e=>e.cat==='wall');return[w.x2,w.z2].join(',')}));
 // escada ponto a ponto no 3D
 await pg.click('[data-a="tool:stair"]');
 await pg.mouse.click(CX-100,CY-60);await pg.waitForTimeout(350);
 await pg.mouse.click(CX+20,CY-60);await pg.waitForTimeout(350);
 await pg.keyboard.press('Enter');await pg.waitForTimeout(250);
 console.log('escada:',await pg.evaluate(()=>{const s=P.els.find(e=>e.cat==='stair');if(!s)return'NÃO CRIADA';const q=stairPlan(P,s);return q.N+' degraus, '+q.segs.length+' lanço(s), sobe para '+q.up}));
 console.log('total de blocos:',await pg.evaluate(()=>Object.values(B.qty).reduce((a,b)=>a+b,0)));
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
