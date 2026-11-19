const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:800}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);
 await pg.evaluate(()=>{openP(newProject());P.els=[];
  const a=P.levels[0].id,b2=P.levels[1].id;
  const fc=mk(P,'fence',{x1:0.5,z1:0.5,x2:7.5,z2:0.5,h:1},a);P.els.push(fc);
  const fl=mk(P,'floor',{pts:[[0.5,0.5],[7.5,0.5],[7.5,5.5],[0.5,5.5]],off:3},a);P.els.push(fl);
  window.__fc=fc;window.__fl=fl;B=build(P);view='plan';lv=a;cam.s=26;cam.x=4;cam.z=3;
  sel=fc.id;SELS=[fc.id];tool='sel';render()});
 await pg.waitForTimeout(250);
 // entra no modo pelo botão (revelado ao passar o cursor)
 await pg.evaluate(()=>document.querySelector('#fb [data-a="attach"]').click());await pg.waitForTimeout(250);
 console.log('1. modo anexar na cerca: '+await pg.evaluate(()=>ATTP===__fc.id)+' | aviso: '+await pg.evaluate(()=>document.querySelector('#toast div')?.textContent.trim().slice(0,60)));
 const XY=async(x,z)=>pg.evaluate(([x,z])=>{const r=c2.getBoundingClientRect();return[r.left+(x-cam.x)*cam.s+c2.clientWidth/2,r.top+(z-cam.z)*cam.s+c2.clientHeight/2]},[x,z]);
 let q=await XY(4.5,3.5);await pg.mouse.move(q[0],q[1]);await pg.waitForTimeout(150);
 console.log('2. piso sob o cursor acende: '+await pg.evaluate(()=>EHOV===__fl.id));
 await pg.mouse.down();await pg.mouse.up();await pg.waitForTimeout(300);
 console.log('3. '+await pg.evaluate(()=>document.querySelector('#toast div')?.textContent.trim().slice(0,70))+' | blocos: '+await pg.evaluate(()=>[...B.vox.values()].filter(v=>v.o===__fc.id).length));
 // excluir o hospedeiro
 await pg.evaluate(()=>{sel=__fl.id;SELS=[__fl.id];render();del()});await pg.waitForTimeout(300);
 console.log('4. diálogo: '+await pg.evaluate(()=>{const d=document.querySelector('#dlg');return d&&d.open?d.textContent.replace(/\s+/g,' ').trim().slice(0,110):'não abriu'}));
 await pg.evaluate(()=>[...document.querySelectorAll('#dlg button')].find(b=>/Voltar/.test(b.textContent)).click());await pg.waitForTimeout(300);
 console.log('5. após excluir o piso: cerca com '+await pg.evaluate(()=>[...B.vox.values()].filter(v=>v.o===__fc.id).length)+' blocos · att='+await pg.evaluate(()=>P.els[0].att));
 console.log(errs.join('\n')||'sem erros');await b.close()})();
