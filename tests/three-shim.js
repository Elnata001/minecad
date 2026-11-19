/* Shim mínimo do three.js com matemática real de raio/plano, para testar a modelagem 3D sem rede. */
window.THREE=(()=>{
 class V2{constructor(x=0,y=0){this.x=x;this.y=y}}
 class V3{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}
  set(x,y,z){this.x=x;this.y=y;this.z=z;return this}
  copy(v){return this.set(v.x,v.y,v.z)}clone(){return new V3(this.x,this.y,this.z)}
  add(v){this.x+=v.x;this.y+=v.y;this.z+=v.z;return this}
  sub(v){this.x-=v.x;this.y-=v.y;this.z-=v.z;return this}
  addScaledVector(v,s){this.x+=v.x*s;this.y+=v.y*s;this.z+=v.z*s;return this}
  multiplyScalar(s){this.x*=s;this.y*=s;this.z*=s;return this}
  dot(v){return this.x*v.x+this.y*v.y+this.z*v.z}
  length(){return Math.hypot(this.x,this.y,this.z)}
  normalize(){const l=this.length()||1;return this.multiplyScalar(1/l)}
  cross(v){return this.set(this.y*v.z-this.z*v.y,this.z*v.x-this.x*v.z,this.x*v.y-this.y*v.x)}
  project(cam){const o=cam.position,f=cam.target.clone().sub(o).normalize(),up=new V3(0,1,0),
    r=f.clone().cross(up).normalize(),u=r.clone().cross(f).normalize(),rel=this.clone().sub(o),
    t=Math.tan(cam.fov*Math.PI/360),z=rel.dot(f)||1e-6;
   return this.set(rel.dot(r)/(z*t*cam.aspect),rel.dot(u)/(z*t),.5)}
  setFromMatrixColumn(m,i){const e=m.e||[1,0,0,0,0,1,0,0,0,0,1,0];return this.set(e[i*4],e[i*4+1],e[i*4+2])}}
 class M4{constructor(){this.e=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}makeTranslation(){return this}multiply(){return this}makeRotationY(){return this}makeScale(){return this}scale(){return this}}
 class Col{constructor(c){this.v=c}set(c){this.v=c;return this}lerp(){return this}}
 class Obj{constructor(){this.children=[];this.position=new V3();this.visible=true;this.userData={};this.matrixWorld=new M4()}
  add(o){this.children.push(o);return this}remove(o){this.children=this.children.filter(x=>x!==o)}
  updateMatrixWorld(){}lookAt(v){this.target=v.clone?v.clone():new V3(v.x,v.y,v.z)}}
 class Geo{constructor(){this.attributes={}}translate(){return this}dispose(){}
  setAttribute(k,a){this.attributes[k]=a;return this}setDrawRange(a,b){this.range=[a,b];return this}}
 /* BoxGeometry de verdade (1 segmento por face), igual ao three.js, para testar as UVs */
 class Buf{constructor(a,n){this.array=a;this.itemSize=n;this.count=a.length/n}
  getX(i){return this.array[i*this.itemSize]}getY(i){return this.array[i*this.itemSize+1]}getZ(i){return this.array[i*this.itemSize+2]}
  setXY(i,x,y){this.array[i*this.itemSize]=x;this.array[i*this.itemSize+1]=y}}
 class BoxG extends Geo{constructor(w=1,h=1,d=1){super();const pos=[],nor=[],uv=[];
   const plane=(u,v,wA,udir,vdir,width,height,depth)=>{const wh=width/2,hh=height/2,dh=depth/2;
    for(let iy=0;iy<2;iy++)for(let ix=0;ix<2;ix++){const x=ix*width-wh,y=iy*height-hh,vec={x:0,y:0,z:0},nv={x:0,y:0,z:0};
     vec[u]=x*udir;vec[v]=y*vdir;vec[wA]=dh;nv[wA]=depth>0?1:-1;
     pos.push(vec.x,vec.y,vec.z);nor.push(nv.x,nv.y,nv.z);uv.push(ix,1-iy)}};
   plane('z','y','x',-1,-1,d,h,w);plane('z','y','x',1,-1,d,h,-w);
   plane('x','z','y',1,1,w,d,h);plane('x','z','y',1,-1,w,d,-h);
   plane('x','y','z',1,-1,w,h,d);plane('x','y','z',-1,-1,w,h,-d);
   this.attributes={position:new Buf(pos,3),normal:new Buf(nor,3),uv:new Buf(uv,2)}}
  translate(x,y,z){const a=this.attributes.position.array;for(let i=0;i<a.length;i+=3){a[i]+=x;a[i+1]+=y;a[i+2]+=z}return this}}
 class Attr{constructor(a,n){this.array=a;this.itemSize=n}setXYZ(i,x,y,z){this.array[i*3]=x;this.array[i*3+1]=y;this.array[i*3+2]=z}}
 class F32Attr extends Attr{constructor(a,n){super(a,n);this.count=a.length/n}}
 class Mat{constructor(o={}){Object.assign(this,o);this.color=new Col(o.color)}dispose(){}}
 class Mesh extends Obj{constructor(g,m){super();this.geometry=g;this.material=m}}
 class Inst extends Mesh{constructor(g,m,n){super(g,m);this.count=n;this.instanceMatrix={needsUpdate:false};this.instanceColor={needsUpdate:false}}
  setMatrixAt(){}setColorAt(){}}
 class Plane{constructor(n,c){this.n=n;this.c=c}}
 class Ray{constructor(o,d){this.origin=o;this.direction=d}
  intersectPlane(p,t){const dn=p.n.dot(this.direction);if(Math.abs(dn)<1e-9)return null;
   const k=-(p.n.dot(this.origin)+p.c)/dn;if(k<0)return null;return t.copy(this.origin).addScaledVector(this.direction,k)}}
 class Raycaster{setFromCamera(v,cam){const o=cam.position.clone(),f=cam.target.clone().sub(o).normalize(),
   up=new V3(0,1,0),r=f.clone().cross(up).normalize(),u=r.clone().cross(f).normalize(),
   t=Math.tan(cam.fov*Math.PI/360);
   this.ray=new Ray(o,f.clone().addScaledVector(r,t*cam.aspect*v.x).addScaledVector(u,t*v.y).normalize())}
  intersectObjects(){return window.__HIT3||[]}}
 return{Vector2:V2,Vector3:V3,Matrix4:M4,Color:Col,Scene:Obj,Object3D:Obj,
  PerspectiveCamera:class extends Obj{constructor(fov,a){super();this.fov=fov;this.aspect=a;this.target=new V3()}updateProjectionMatrix(){}},
  WebGLRenderer:class{constructor(){this.domElement=document.createElement('canvas')}setSize(){}setPixelRatio(){}setClearColor(){}render(){window.__R3=(window.__R3||0)+1}},
  AmbientLight:Obj,DirectionalLight:Obj,GridHelper:class extends Obj{constructor(){super();this.material={transparent:false,opacity:1,color:new Col()}}},
  BoxGeometry:BoxG,EdgesGeometry:Geo,BufferGeometry:Geo,BufferAttribute:Attr,Float32BufferAttribute:F32Attr,
  MeshLambertMaterial:Mat,MeshBasicMaterial:Mat,LineBasicMaterial:Mat,
  Mesh,Line:Mesh,LineSegments:Mesh,InstancedMesh:Inst,Raycaster,Plane,
  CanvasTexture:class{constructor(c){this.image=c;this.needsUpdate=false}dispose(){}},NearestFilter:1003}
})();
