const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1360,height:900},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message+' @ '+String(e.stack||'').split('\n')[1]));
 pg.on('dialog',d=>d.accept(d.type()==='prompt'?'Banco de jardim':undefined));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 await pg.evaluate(()=>{openP(newProject());P.els=[];
  P.els.push(mk(P,'floor',{pts:[[.5,.5],[12.5,.5],[12.5,10.5],[.5,10.5]],mat:'oak_planks',t:1,off:0},lv));
  B=build(P);fit();cam.s=40;render()});
 // biblioteca
 await pg.evaluate(()=>dlgComp());await pg.waitForTimeout(400);
 const lib=await pg.evaluate(()=>{const c=[...document.querySelectorAll('.ccard')];
  return{cartoes:c.length,nomes:c.map(x=>x.querySelector('b').textContent).join(', '),
   miniaturas:c.filter(x=>{const cv=x.querySelector('canvas');if(!cv)return false;const g=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;for(let i=3;i<g.length;i+=4)if(g[i]>0)return true;return false}).length}});
 console.log('biblioteca:',lib.cartoes,'cartões |',lib.miniaturas,'miniaturas desenhadas');
 console.log('nomes:',lib.nomes);
 await pg.evaluate(()=>{const d=document.querySelector('#dlg');d.querySelector('.cgrid').style.maxHeight='none'});await pg.waitForTimeout(200);await (await pg.$('#dlg')).screenshot({path:'/tmp/sD.png'});
 // inserir a cadeira
 const chair=await pg.evaluate(()=>LIB.find(d=>d.name==='Cadeira').id);
 await pg.click(`[data-a="cuse:${chair}"]`);await pg.waitForTimeout(300);
 console.log('ferramenta após Inserir:',await pg.evaluate(()=>tool),'| definição no desenho:',await pg.evaluate(()=>(defOf(DEF.comp.def)||{}).name));
 const bb=await (await pg.$('#c2')).boundingBox(),C=(dx,dy)=>[bb.x+bb.width/2+dx,bb.y+bb.height/2+dy];
 await pg.mouse.move(...C(-60,-40));await pg.waitForTimeout(150);
 await pg.mouse.click(...C(-60,-40));await pg.waitForTimeout(200);
 await pg.keyboard.press(' ');await pg.waitForTimeout(150);
 await pg.mouse.click(...C(40,-40));await pg.waitForTimeout(200);
 await pg.mouse.click(...C(120,40));await pg.waitForTimeout(250);
 console.log('instâncias:',await pg.evaluate(()=>P.els.filter(e=>e.cat==='comp').map(e=>e.name+' rot'+e.rot+' host='+((P.els.find(x=>x.id===e.host)||{}).name||'—')).join(' | ')));
 console.log('blocos:',await pg.evaluate(()=>JSON.stringify(B.qty)));
 await pg.screenshot({path:'/tmp/sE.png'});
 // propriedades da instância
 await pg.evaluate(()=>{tool='sel';sel=P.els.filter(e=>e.cat==='comp')[0].id;SELS=[sel];render()});await pg.waitForTimeout(250);
 console.log('painel:',(await pg.textContent('#props')).replace(/\s+/g,' ').slice(0,230));
 // modo de criação
 const antes=await pg.evaluate(()=>({els:P.els.length,nome:P.name}));
 await pg.evaluate(()=>cEnter('Banco de jardim',null));await pg.waitForTimeout(300);
 console.log('modo de criação: projeto =',await pg.evaluate(()=>P.name),'| elementos =',await pg.evaluate(()=>P.els.length),'| barra:',(await pg.textContent('#props')).replace(/\s+/g,' ').slice(0,60));
 await pg.evaluate(()=>{tool='block';for(const[x,y,m,o]of[[0,0,'oak_fence',null],[2,0,'oak_fence',null],[0,1,'oak_slab',{hf:'bottom'}],[1,1,'oak_slab',{hf:'bottom'}],[2,1,'oak_slab',{hf:'bottom'}],[1,2,'oak_stairs',{fc:'north'}]])
  P.els.push(mk(P,'block',Object.assign({x1:x+.5,z1:.5,off:y,mat:m},o||{}),lv));B=build(P);render()});
 await pg.waitForTimeout(200);
 await pg.click('[data-a="cdone"]');await pg.waitForTimeout(500);
 console.log('após concluir: projeto =',await pg.evaluate(()=>P.name),'| elementos =',await pg.evaluate(()=>P.els.length),'(antes',antes.els+') | biblioteca =',await pg.evaluate(()=>LIB.length));
 console.log('novo componente:',await pg.evaluate(()=>{const d=LIB[LIB.length-1];return d.name+' · '+d.cells.length+' células · âncora relativa '+d.cells.map(c=>c.x+','+c.y+','+c.z).join(' ')}));
 // exportar / importar por arquivo
 const cj=await pg.evaluate(()=>JSON.stringify({mcomp:1,def:LIB[LIB.length-1]}));
 require('fs').writeFileSync('/tmp/c2.mcomp.json',cj);
 await pg.evaluate(()=>{$('#dlg').close();cImp()});await pg.waitForTimeout(250);
 await pg.setInputFiles('#cjf','/tmp/c2.mcomp.json');await pg.click('[data-a="cimpgo"]');await pg.waitForTimeout(400);
 console.log('pré-visualização da importação:',(await pg.textContent('#cprev')).replace(/\s+/g,' ').slice(0,120));
 await pg.click('[data-a="cimpok:new"]');await pg.waitForTimeout(300);
 console.log('após importar como cópia:',await pg.evaluate(()=>LIB.map(d=>d.name).join(', ')));
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
