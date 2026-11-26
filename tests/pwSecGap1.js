/* Fachada e corte: pelos vazios de escada, laje e cerca aparece o que está atrás.
   O desenho guardava só o bloco da frente de cada célula, e o vazio dele virava buraco na cor do
   fundo — era o que parecia um bloco faltando abaixo da cobertura. */
const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:700}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);

 /* Parede ao longo de Z com escadas e uma cerca na frente dela. Na Fachada Leste a parede corre
    pela largura da vista e as escadas ficam entre ela e quem olha. */
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];
  const l0=P.levels[0].id;
  P.els.push(mk(P,'wall',{x1:0,z1:0,x2:0,z2:10,h:8},l0));
  for(let z=0;z<6;z++)P.els.push(mk(P,'block',{x1:1.5,z1:z+.5,mat:'oak_stairs',fc:'north',hf:'bottom',off:3},l0));
  P.els.push(mk(P,'fence',{x1:1.5,z1:6.5,x2:1.5,z2:9.5,mat:'oak_fence',h:2,off:3},l0));
  B=build(P);
  const c={};for(const v of B.vox.values()){const k=B.cats[v.o];c[k]=(c[k]||0)+1}
  return 'modelo: '+JSON.stringify(c)}));

 console.log(await pg.evaluate(()=>{view='sec';SV={id:'E',cam:null};tool='sel';sel=null;SELS=[];render();
  return 'vista: '+svDef().name+' · células desenhadas: '+SEC.cells.size}));

 console.log(await pg.evaluate(()=>{const{lx,lz,cells}=SEC;let n=0,tipos={};
  for(const[k,L]of cells){if(L.length<2)continue;
   const R=secRects(L[0].v,lx,lz);if(secFull(R))continue;
   n++;const c=B.cats[L[0].v.o];tipos[c]=(tipos[c]||0)+1}
  return 'células com bloco parcial na frente e algo atrás: '+n+' '+JSON.stringify(tipos)}));

 /* nenhum quadrante dessas células pode ficar na cor do fundo */
 console.log(await pg.evaluate(()=>{const c=$('#c3'),g=c.getContext('2d'),d=devicePixelRatio||1;
  const{lx,lz,cells,S,cu,cy,w,h}=SEC;
  const t=document.createElement('canvas').getContext('2d');
  t.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--cv').trim();
  t.fillRect(0,0,1,1);const[r0,g0,b0]=t.getImageData(0,0,1,1).data;
  const X=u=>(u-cu)*S+w/2,Y=y=>h/2-(y-cy)*S;
  let olhadas=0,furadas=0,ex='';
  for(const[k,L]of cells){
   if(L.length<2||secFull(secRects(L[0].v,lx,lz)))continue;
   const[u,y]=k.split(',').map(Number);olhadas++;
   for(const[fx,fy]of[[.25,.25],[.75,.25],[.25,.75],[.75,.75]]){
    const px=Math.round((X(u)+fx*S)*d),py=Math.round((Y(y+1)+fy*S)*d);
    if(px<2||py<2||px>c.width-2||py>c.height-2)continue;
    const p=g.getImageData(px,py,1,1).data;
    if(Math.abs(p[0]-r0)<6&&Math.abs(p[1]-g0)<6&&Math.abs(p[2]-b0)<6){
     furadas++;if(!ex)ex=' (ex.: u='+u+' y='+y+' quadrante '+fx+'/'+fy+')';break}}}
  return 'células conferidas: '+olhadas+' · com pedaço na cor do fundo: '+furadas+ex
   +(furadas?' — FALHOU':' (nenhuma)')}));

 /* o desenho não vai até o fundo da pilha à toa: para no primeiro bloco que fecha a célula */
 console.log(await pg.evaluate(()=>{const{lx,lz,cells}=SEC;let maior=0;
  for(const L of cells.values()){let n=L.length;
   for(let i=0;i<L.length;i++)if(secFull(secRects(L[i].v,lx,lz))){n=i+1;break}
   if(n>maior)maior=n}
  return 'camadas desenhadas na célula mais funda: '+maior+' (limite por célula: '+SECD+')'}));

 if(errs.length)console.log(errs.join('\n'));
 await b.close()})();
