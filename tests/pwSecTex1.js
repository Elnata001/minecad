/* Texturas na fachada e no corte: a porta usa a textura da metade certa e espelha pela
   dobradiça, e as formas vazadas (painel, cerca, muro) não pintam faixa nenhuma duas vezes. */
const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:700}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);

 /* um pacote de texturas montado à mão: a leitura do .jar depende de rede, e o que importa aqui
    é só que exista textura de baixo e de cima para a porta */
 console.log(await pg.evaluate(()=>{const mk16=(l,r)=>{const c=document.createElement('canvas');
   c.width=c.height=16;const g=c.getContext('2d');g.fillStyle=l;g.fillRect(0,0,8,16);g.fillStyle=r;g.fillRect(8,0,8,16);return c};
  PACK={oak_door:{s:mk16('#ff0000','#00ff00'),t:mk16('#0000ff','#ffff00'),b:null}};
  TXON=true;PAT.clear();T3.clear();
  return 'pacote de teste: baixo vermelho|verde, cima azul|amarelo'}));

 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];const l0=P.levels[0].id;
  const w=mk(P,'wall',{x1:0,z1:0,x2:0,z2:8,h:5,mat:'stone_bricks'},l0);P.els.push(w);
  P.els.push(mk(P,'door',{host:w.id,pos:3,mat:'oak_door'},l0));
  B=build(P);view='sec';SV={id:'E',cam:{u:-4,y:2,s:40}};tool='sel';sel=null;SELS=[];render();
  const ds=[...B.vox.values()].filter(v=>v.d&&v.dw).sort((a,b)=>a.y-b.y);
  return 'porta: '+ds.map(v=>v.dw.half+' (dobradiça '+v.dw.hinge+') · face na fachada: '
   +JSON.stringify(secFace(v,SEC.lx,SEC.lz))).join(' | ')}));

 /* a cor no meio de cada metade da porta, lida da tela */
 const cor=async(u,y,fx)=>await pg.evaluate(([u,y,fx])=>{const c=$('#c3'),g=c.getContext('2d'),d=devicePixelRatio||1;
  const X=(u+fx-SEC.cu)*SEC.S+SEC.w/2,Y=SEC.h/2-(y+.5-SEC.cy)*SEC.S;
  const p=g.getImageData(Math.round(X*d),Math.round(Y*d),1,1).data;
  return '#'+[p[0],p[1],p[2]].map(n=>n.toString(16).padStart(2,'0')).join('')},[u,y,fx]);

 const dy=await pg.evaluate(()=>{const ds=[...B.vox.values()].filter(v=>v.d&&v.dw).sort((a,b)=>a.y-b.y);
  const u=-SEC.lz*ds[0].x+SEC.lx*ds[0].z;return[u,ds[0].y,ds[1].y]});
 console.log('metade de baixo (u='+dy[0]+' y='+dy[1]+'): esquerda '+await cor(dy[0],dy[1],.25)+' · direita '+await cor(dy[0],dy[1],.75));
 console.log('metade de cima  (u='+dy[0]+' y='+dy[2]+'): esquerda '+await cor(dy[0],dy[2],.25)+' · direita '+await cor(dy[0],dy[2],.75));
 console.log(await pg.evaluate(()=>'as duas metades usam texturas diferentes: '
  +((()=>{const ds=[...B.vox.values()].filter(v=>v.d&&v.dw).sort((a,b)=>a.y-b.y);
    return txOf(ds[0],secFace(ds[0],SEC.lx,SEC.lz))!==txOf(ds[1],secFace(ds[1],SEC.lx,SEC.lz))})())));

 /* formas vazadas: nenhum retângulo pode cobrir outro, ou o translúcido sai pintado duas vezes */
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];const l0=P.levels[0].id;
  P.els.push(mk(P,'window',{x1:0,z1:0,x2:0,z2:6,h:2,off:1,mat:'glass_pane'},l0));
  P.els.push(mk(P,'fence',{x1:2.5,z1:.5,x2:2.5,z2:5.5,mat:'oak_fence',h:2},l0));
  B=build(P);view='sec';SV={id:'E',cam:null};render();
  const{lx,lz,cells}=SEC;let piores=[],n=0;
  for(const L of cells.values())for(const o of L){const R=secRects(o.v,lx,lz);n++;
   for(let i=0;i<R.length;i++)for(let j=i+1;j<R.length;j++){
    const a=R[i],b2=R[j];
    const ox=Math.min(a[0]+a[2],b2[0]+b2[2])-Math.max(a[0],b2[0]),
     oy=Math.min(a[1]+a[3],b2[1]+b2[3])-Math.max(a[1],b2[1]);
    if(ox>1e-9&&oy>1e-9)piores.push(B.cats[o.v.o]+'/'+o.v.m+' '+JSON.stringify([a,b2]))}}
  return 'formas conferidas: '+n+' · retângulos sobrepostos: '+piores.length
   +(piores.length?' — FALHOU: '+piores[0]:' (nenhum)')}));

 /* o painel ligado dos dois lados cobre a célula inteira: nada atrás dele aparece por engano */
 console.log(await pg.evaluate(()=>{const{lx,lz,cells}=SEC;const r=[];
  for(const[k,L]of cells){const v=L[0].v;if((MATS[v.m]||[])[2]!=='w')continue;
   const R=secRects(v,lx,lz);let a=0;for(const q of R)a+=q[2]*q[3];
   r.push(k+' área='+a.toFixed(3)+' cobre tudo='+secFull(R))}
  return 'painéis: '+(r.length?r.join(' | '):'nenhum')}));

 if(errs.length)console.log(errs.join('\n'));
 await b.close()})();
