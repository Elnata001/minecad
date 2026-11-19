/* O aplicativo é o index.html da raiz do repositório. Em vez de duplicá-lo no
   controle de versão, ele é copiado para desktop/app/ na hora de empacotar. */
const fs=require('fs'),path=require('path');
const raiz=path.join(__dirname,'..','..'),destino=path.join(__dirname,'..','app');
fs.mkdirSync(destino,{recursive:true});
fs.copyFileSync(path.join(raiz,'index.html'),path.join(destino,'index.html'));
const n=fs.statSync(path.join(destino,'index.html')).size;
console.log('index.html copiado para desktop/app ('+(n/1024).toFixed(0)+' KB)');
