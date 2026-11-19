const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message+' @ '+String(e.stack||'').split('\n')[1]));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 await pg.evaluate(()=>{openP(newProject());P.els=[];
  P.els.push(mk(P,'floor',{pts:[[.5,.5],[12.5,.5],[12.5,10.5],[.5,10.5]],mat:'oak_planks',t:1,off:0},lv));
  B=build(P);o.t.set(6,0,5);o.r=30;o.th=.9;o.ph=1;DEF.comp.def=LIB.find(d=>d.name==='Mesa 2×2').id;tool='comp';setView('3d')});
 const bb=await (await pg.$('#v3')).boundingBox(),CX=bb.x+bb.width/2,CY=bb.y+bb.height/2;
 await pg.mouse.move(CX,CY);await pg.waitForTimeout(250);
 console.log('prévia 3D:',await pg.evaluate(()=>CPV?('visível, '+CPV.count+' blocos em '+[CPV.position.x,CPV.position.y,CPV.position.z].join(',')):'NÃO CRIADA'));
 // sobre o piso: o clique usa o topo da face como hospedeiro
 await pg.evaluate(()=>{window.__HIT3=[{point:{x:6.5,y:0,z:5.5},instanceId:0,object:{userData:{o:P.els[0].id}}}]});
 await pg.mouse.move(CX,CY);await pg.waitForTimeout(200);
 await pg.mouse.click(CX,CY);await pg.waitForTimeout(300);
 console.log('inserido no 3D:',await pg.evaluate(()=>{const c=P.els.find(e=>e.cat==='comp');return c?c.name+' em X'+Math.floor(c.x1)+' Z'+Math.floor(c.z1)+' host='+((P.els.find(x=>x.id===c.host)||{}).name||'—')+' off='+c.off:'NADA'}));
 console.log('células do componente:',await pg.evaluate(()=>{const c=P.els.find(e=>e.cat==='comp');return [...B.vox.values()].filter(v=>v.o===c.id).map(v=>v.x+','+v.y+','+v.z).sort().join(' ')}));
 await pg.evaluate(()=>{window.__HIT3=null});
 // girar com Espaço e inserir outra
 await pg.keyboard.press(' ');await pg.waitForTimeout(150);
 console.log('rotação do desenho após Espaço:',await pg.evaluate(()=>DEF.comp.rot));
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
