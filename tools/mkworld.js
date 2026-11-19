/* gerador de arquivos de teste: escreve NBT de verdade (região, estrutura e esquema) */
const zlib=require('zlib'),fs=require('fs');
class W{constructor(){this.b=[];}
 u8(v){this.b.push(Buffer.from([v&255]))}
 i8(v){const x=Buffer.alloc(1);x.writeInt8(v);this.b.push(x)}
 i16(v){const x=Buffer.alloc(2);x.writeInt16BE(v);this.b.push(x)}
 i32(v){const x=Buffer.alloc(4);x.writeInt32BE(v);this.b.push(x)}
 i64(v){const x=Buffer.alloc(8);x.writeBigUInt64BE(BigInt.asUintN(64,BigInt(v)));this.b.push(x)}
 str(s){const x=Buffer.from(s,'utf8');this.i16(x.length);this.b.push(x)}
 raw(x){this.b.push(x)}
 out(){return Buffer.concat(this.b)}}
const T={byte:1,short:2,int:3,long:4,float:5,double:6,barr:7,str:8,list:9,comp:10,iarr:11,larr:12};
function tagOf(v){
 if(typeof v==='string')return T.str;
 if(typeof v==='number')return Number.isInteger(v)?T.int:T.double;
 if(typeof v==='bigint')return T.long;
 if(Buffer.isBuffer(v))return T.barr;
 if(v&&v.__t)return v.__t;
 if(Array.isArray(v))return T.list;
 if(v&&typeof v==='object')return T.comp;
 throw new Error('tipo '+typeof v)}
function wval(w,v,t){t=t||tagOf(v);
 switch(t){
  case T.byte:return w.i8(v.__v!==undefined?v.__v:v);
  case T.short:return w.i16(v.__v!==undefined?v.__v:v);
  case T.int:return w.i32(v.__v!==undefined?v.__v:v);
  case T.long:return w.i64(v.__v!==undefined?v.__v:v);
  case T.str:return w.str(v);
  case T.barr:{const b=v.__v||v;w.i32(b.length);w.raw(Buffer.from(b));return}
  case T.iarr:{const a=v.__v;w.i32(a.length);for(const x of a)w.i32(x);return}
  case T.larr:{const a=v.__v;w.i32(a.length);for(const x of a)w.i64(x);return}
  case T.list:{const a=v.__v||v,it=a.length?tagOf(a[0]):T.byte;w.u8(it);w.i32(a.length);for(const x of a)wval(w,x,it);return}
  case T.comp:{const o=v.__v||v;for(const k in o){if(k==='__t'||k==='__v')continue;const tt=tagOf(o[k]);w.u8(tt);w.str(k);wval(w,o[k],tt)}w.u8(0);return}}}
const B=v=>({__t:T.byte,__v:v}),S=v=>({__t:T.short,__v:v}),IA=v=>({__t:T.iarr,__v:v}),LA=v=>({__t:T.larr,__v:v}),BA=v=>({__t:T.barr,__v:v});
function nbt(root){const w=new W();w.u8(T.comp);w.str('');wval(w,root,T.comp);return w.out()}

/* --- terreno sintético: a mesma fórmula que o teste confere --- */
const GH=(x,z)=>Math.round(64+8*Math.sin(x/19)+6*Math.cos(z/13)+3*Math.sin((x+z)/7));
const treeAt=(x,z)=>((x*7+z*13)%97)===0;          /* árvore esparsa */
const houseX=[20,27],houseZ=[20,27];               /* uma casa de tábuas */
const inHouse=(x,z)=>x>=houseX[0]&&x<=houseX[1]&&z>=houseZ[0]&&z<=houseZ[1];
const lakeAt=(x,z)=>Math.hypot(x-90,z-40)<10;      /* um lago */
function colBlocks(x,z){/* devolve [{y,b}] desta coluna */
 const h=GH(x,z),o=[];
 for(let y=h-6;y<=h;y++)o.push({y,b:y===h?'minecraft:grass_block':(y>h-4?'minecraft:dirt':'minecraft:stone')});
 if(lakeAt(x,z)){const wl=GH(90,40)-2;for(let y=h-3;y<=h;y++)o.length&&0;
  /* escava e enche de água até wl */
  for(let i=o.length-1;i>=0;i--)if(o[i].y>wl-3)o.splice(i,1);
  for(let y=wl-2;y<=wl;y++)o.push({y,b:'minecraft:water'})}
 else if(treeAt(x,z)){for(let y=h+1;y<=h+5;y++)o.push({y,b:'minecraft:oak_log'});
  for(let y=h+4;y<=h+7;y++)o.push({y,b:'minecraft:oak_leaves'})}
 else if(inHouse(x,z)){for(let y=h+1;y<=h+4;y++)o.push({y,b:'minecraft:oak_planks'})}
 return o}

/* --- região .mca: 8x8 chunks --- */
function section(Y,get){/* get(x,y,z)->nome */
 const pal=[],ix=new Map(),idx=new Int32Array(4096);
 const id=n=>{let i=ix.get(n);if(i===undefined){i=pal.length;pal.push(n);ix.set(n,i)}return i};
 id('minecraft:air');
 for(let y=0;y<16;y++)for(let z=0;z<16;z++)for(let x=0;x<16;x++)idx[(y<<8)|(z<<4)|x]=id(get(x,Y*16+y,z));
 if(pal.length===1)return null;
 const bits=Math.max(4,32-Math.clz32(pal.length-1)),per=Math.floor(64/bits),n=Math.ceil(4096/per),L=[];
 for(let i=0;i<n;i++){let v=0n;for(let j=0;j<per;j++){const k=i*per+j;if(k>=4096)break;
   v|=BigInt(idx[k])<<BigInt(j*bits)}L.push(BigInt.asIntN(64,v))}
 return{Y:B(Y),block_states:{palette:pal.map(n=>({Name:n})),data:LA(L)}}}
function chunkNBT(cx,cz){
 const col=new Map();
 for(let z=0;z<16;z++)for(let x=0;x<16;x++)col.set(x+','+z,colBlocks(cx*16+x,cz*16+z));
 const at=(x,y,z)=>{const c=col.get(x+','+z);for(const b of c)if(b.y===y)return b.b;return 'minecraft:air'};
 const secs=[];
 for(let Y=2;Y<=5;Y++){const s=section(Y,at);if(s)secs.push(s)}
 return{DataVersion:3465,xPos:cx,zPos:cz,yPos:-4,Status:'minecraft:full',sections:secs,
  Heightmaps:{}}}
function mkRegion(path,nc){
 const heads=Buffer.alloc(8192),parts=[];let sector=2;
 for(let cz=0;cz<nc;cz++)for(let cx=0;cx<nc;cx++){
  const raw=zlib.deflateSync(nbt(chunkNBT(cx,cz)));
  const body=Buffer.alloc(5+raw.length);body.writeInt32BE(raw.length+1,0);body.writeUInt8(2,4);raw.copy(body,5);
  const pad=Math.ceil(body.length/4096)*4096,buf=Buffer.alloc(pad);body.copy(buf,0);
  const i=(cx&31)+(cz&31)*32;
  heads.writeUInt8((sector>>16)&255,i*4);heads.writeUInt8((sector>>8)&255,i*4+1);heads.writeUInt8(sector&255,i*4+2);
  heads.writeUInt8(pad/4096,i*4+3);
  parts.push(buf);sector+=pad/4096}
 fs.writeFileSync(path,Buffer.concat([heads,...parts]));
 return fs.statSync(path).size}

/* --- estrutura .nbt: 24x24 --- */
function mkStruct(path,W2,L2){
 const blocks=[],pal=[],ix=new Map();
 const id=n=>{let i=ix.get(n);if(i===undefined){i=pal.length;pal.push({Name:n});ix.set(n,i)}return i};
 let ymin=1e9,ymax=-1e9;
 for(let z=0;z<L2;z++)for(let x=0;x<W2;x++)for(const b of colBlocks(x,z)){ymin=Math.min(ymin,b.y);ymax=Math.max(ymax,b.y)}
 const H2=ymax-ymin+1;
 for(let z=0;z<L2;z++)for(let x=0;x<W2;x++)for(const b of colBlocks(x,z))
  blocks.push({state:id(b.b),pos:[x,b.y-ymin,z]});
 fs.writeFileSync(path,zlib.gzipSync(nbt({DataVersion:3465,size:[W2,H2,L2],palette:pal,blocks,author:'teste'})));
 return{W:W2,H:H2,L:L2,ymin}}

/* --- esquema .schem v2: 32x32 --- */
function mkSchem(path,W2,L2,ox,oz){
 const pal={'minecraft:air':0},names=['minecraft:air'];
 const id=n=>{if(pal[n]===undefined){pal[n]=names.length;names.push(n)}return pal[n]};
 let ymin=1e9,ymax=-1e9;
 for(let z=0;z<L2;z++)for(let x=0;x<W2;x++)for(const b of colBlocks(x+ox,z+oz)){ymin=Math.min(ymin,b.y);ymax=Math.max(ymax,b.y)}
 const H2=ymax-ymin+1,vol=new Int32Array(W2*H2*L2);
 for(let z=0;z<L2;z++)for(let x=0;x<W2;x++)for(const b of colBlocks(x+ox,z+oz))
  vol[((b.y-ymin)*L2+z)*W2+x]=id(b.b);
 const bytes=[];for(const v of vol){let n=v;do{let c=n&127;n>>>=7;if(n)c|=128;bytes.push(c)}while(n)}
 fs.writeFileSync(path,zlib.gzipSync(nbt({Version:2,DataVersion:3465,Width:S(W2),Height:S(H2),Length:S(L2),
  Offset:IA([ox,ymin,oz]),PaletteMax:names.length,Palette:Object.fromEntries(names.map((n,i)=>[n,i])),BlockData:BA(Buffer.from(bytes))})));
 return{W:W2,H:H2,L:L2,ymin}}

const r=mkRegion('/tmp/w/r.0.0.mca',8);
function mkRegion2(path,nc,bx){const heads=Buffer.alloc(8192),parts=[];let sector=2;
 for(let cz=0;cz<nc;cz++)for(let cx=0;cx<nc;cx++){const CX=bx+cx;
  const raw=zlib.deflateSync(nbt(chunkNBT(CX,cz)));
  const body=Buffer.alloc(5+raw.length);body.writeInt32BE(raw.length+1,0);body.writeUInt8(2,4);raw.copy(body,5);
  const pad=Math.ceil(body.length/4096)*4096,buf=Buffer.alloc(pad);body.copy(buf,0);
  const i=(CX&31)+(cz&31)*32;
  heads.writeUInt8((sector>>16)&255,i*4);heads.writeUInt8((sector>>8)&255,i*4+1);heads.writeUInt8(sector&255,i*4+2);
  heads.writeUInt8(pad/4096,i*4+3);parts.push(buf);sector+=pad/4096}
 fs.writeFileSync(path,Buffer.concat([heads,...parts]))}
mkRegion2('/tmp/w/r.0.0b.mca',8,8);
const st=mkStruct('/tmp/w/casa.nbt',24,24);
const sc=mkSchem('/tmp/w/recorte.schem',32,32,40,16);
console.log('região: '+(r/1024).toFixed(0)+' KB, 8×8 chunks (128×128 blocos)');
console.log('estrutura: '+JSON.stringify(st));
console.log('esquema: '+JSON.stringify(sc));
console.log('altura esperada em (10,10): '+GH(10,10)+' · (100,100): '+GH(100,100));
