const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);

 console.log(await pg.evaluate(()=>{const v=MENUS.Visualizar.map(x=>x[0]);
  return '1) menu Visualizar: '+v.join(' | ')+'\n   só dois itens: '+(v.length===2&&v[0].startsWith('Texturas')&&v[1].startsWith('Navegação'))}));

 console.log(await pg.evaluate(()=>{const o=[];dlgPack();
  const r=document.querySelector('#dlg input[data-shi]');o.push('2) slider de sombras no diálogo Texturas: '+!!r);
  if(r){o.push('   faixa '+r.min+'–'+r.max+'%, valor inicial '+r.value);
   r.value='40';r.dispatchEvent(new Event('input',{bubbles:true}));
   o.push('   40% → SHI '+SHI+' · rótulo '+document.querySelector('#shiv').textContent+' · guardado '+LS.g('mc:shi'));
   r.value='0';r.dispatchEvent(new Event('input',{bubbles:true}));o.push('   0% → SHI '+SHI);
   r.value='100';r.dispatchEvent(new Event('input',{bubbles:true}));o.push('   100% → SHI '+SHI)}
  $('#dlg').close();return o.join('\n')}));

 // 3) as sombras realmente respondem ao ajuste
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];view='plan';lv=P.levels[0].id;cam.s=26;cam.x=9;cam.z=7;
  const a=lv;P.els.push(mk(P,'floor',{pts:[[1.5,1.5],[16.5,12.5]],pk:'rect',closed:true,off:0,mat:'oak_planks'},a));
  const w1=mkWall(P,[1.5,1.5],[16.5,1.5],a);w1.h=4;P.els.push(w1);
  B=build(P);tool='sel';sel=null;SELS=[];render();return '3) cena de teste: '+B.vox.size+' blocos'}));
 const probe=async()=>pg.evaluate(()=>{const d=devicePixelRatio||1,W=c2.clientWidth,H=c2.clientHeight,S=cam.s,
  X=Math.round(((5-cam.x)*S+W/2)*d),Z=Math.round(((2-cam.z)*S+H/2)*d),R=Math.round(S*d*3);
  const im=c2.getContext('2d').getImageData(X,Z,R,Math.round(S*d*1.2)).data;let s=0;
  for(let i=0;i<im.length;i+=4)s+=(im[i]+im[i+1]+im[i+2])/3;return Math.round(s/(im.length/4))});
 await pg.evaluate(()=>{SHI=0;draw2d()});const a0=await probe();
 await pg.evaluate(()=>{SHI=1;draw2d()});const a1=await probe();
 await pg.evaluate(()=>{SHI=1.5;draw2d()});const a2=await probe();
 console.log('   brilho do piso junto à parede · 0%: '+a0+' · 100%: '+a1+' · 150%: '+a2
  +'\n   mais intensidade = mais escuro: '+(a0>a1&&a1>a2));
 await pg.evaluate(()=>{SHI=1;draw2d()});

 // 4) duplo clique do botão do meio
 console.log(await pg.evaluate(()=>{const r=[];
  const ev=i=>new PointerEvent('pointerdown',{button:1,buttons:4,clientX:400,clientY:400,bubbles:true,pointerId:i});
  const hit=(el,i)=>{try{el.onpointerdown(ev(i))}catch(err){}};
  cam.s=4;cam.x=-80;cam.z=-80;MBT=0;
  hit(c2,1);r.push('4) planta · 1 clique: '+(cam.s===4?'nada muda':'ERRO enquadrou cedo'));
  hit(c2,1);r.push('   planta · 2 cliques rápidos: '+(cam.s!==4?'enquadrou (escala '+cam.s.toFixed(1)+', centro '+cam.x.toFixed(1)+')':'NÃO enquadrou'));
  cam.s=4;cam.x=-80;MBT=0;hit(c2,1);MBT=performance.now()-900;hit(c2,1);
  r.push('   planta · 2 cliques lentos: '+(cam.s===4?'ignorados, como deve ser':'ERRO enquadrou'));
  view='3d';render();
  if(typeof o!=='undefined'&&o){o.r=999;MBT=0;hit(v3,2);
   r.push('   3D · 1 clique: '+(o.r===999?'nada muda':'ERRO'));
   hit(v3,2);r.push('   3D · 2 cliques rápidos: '+(o.r!==999?'enquadrou (raio '+o.r.toFixed(1)+')':'NÃO enquadrou'))}
  else r.push('   3D: órbita indisponível no shim');
  view='plan';render();return r.join('\n')}));

 // 5) escada vinda do pavimento inferior
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];view='plan';cam.s=24;cam.x=7;cam.z=9;
  if(P.levels.length<2)addLevel();const l0=P.levels[0],l1=P.levels[1];
  const st=mk(P,'stair',{pts:[[4.5,2.5],[4.5,14.5]],w:2,base:l0.id,top:l1.id},l0.id);P.els.push(st);
  // piso do nível de cima com o vão da escada aberto
  P.els.push(mk(P,'floor',{pts:[[7.5,0.5],[13.5,18.5]],pk:'rect',closed:true,off:0,mat:'oak_planks'},l1.id));
  B=build(P);lv=l1.id;tool='sel';sel=null;SELS=[];render();
  const cs=[...B.vox.values()].filter(v=>v.o===st.id),ys=cs.map(v=>v.y);
  window.__st=st.id;window.__cell=cs.sort((p,q)=>p.y-q.y)[0];
  return '5) nível de cima · elev '+l1.elev+' · faixa de vista de '+botY()+' a '+cutY()
   +'\n   escada: '+cs.length+' blocos, y de '+Math.min(...ys)+' a '+Math.max(...ys)
   +'\n   blocos abaixo da faixa (antes invisíveis): '+cs.filter(v=>v.y<botY()).length}));
 const cell=async()=>pg.evaluate(()=>{const v=window.__cell,d=devicePixelRatio||1,W=c2.clientWidth,H=c2.clientHeight,S=cam.s,
  X=Math.round(((v.x+.5-cam.x)*S+W/2)*d),Z=Math.round(((v.z+.5-cam.z)*S+H/2)*d);
  const p=c2.getContext('2d').getImageData(X,Z,2,2).data;return p[0]+','+p[1]+','+p[2]});
 const c1=await cell();
 await pg.evaluate(()=>{(P.hid=P.hid||{})[vkey()]=[window.__st];render()});
 const c2c=await cell();
 await pg.evaluate(()=>{P.hid={};render()});
 console.log('   pixel do degrau mais baixo · com a escada: '+c1+' · com a escada oculta: '+c2c
  +'\n   o degrau de baixo é desenhado: '+(c1!==c2c));
 await pg.waitForTimeout(250);
 await pg.screenshot({path:'/tmp/vis_stair.png',clip:{x:76,y:140,width:660,height:560}});
 console.log(errs.length?errs.join('\n'):'SEM ERROS');
 await b.close()})();
