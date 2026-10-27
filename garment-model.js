import * as THREE from 'three';

// A bespoke visualization mesh reconstructed from the available front photograph.
// Dimensions, reverse construction and drape are artistic approximations, not a sewing pattern.
export function buildGarment(){
 const group=new THREE.Group();group.name='FlowerLady_Reconstructed_Satin_Set';
 const fabric=new THREE.MeshPhysicalMaterial({color:0xd4aeb9,roughness:.34,metalness:0,side:THREE.DoubleSide,sheen:1,sheenColor:new THREE.Color(0xffe3ea),sheenRoughness:.43,clearcoat:.12,clearcoatRoughness:.36,iridescence:.04,iridescenceIOR:1.25});
 const trim=fabric.clone();trim.color.set(0xc5a4a7);trim.roughness=.43;
 const thread=new THREE.MeshStandardMaterial({color:0xb9989b,roughness:.75});
 function surface(name,fn,n=112,m=80,mat=fabric){
  const positions=[],uv=[],indices=[];
  for(let j=0;j<=m;j++)for(let i=0;i<=n;i++){const u=i/n,v=j/m;positions.push(...fn(u,v));uv.push(u,v);}
  for(let j=0;j<m;j++)for(let i=0;i<n;i++){const a=j*(n+1)+i,b=a+n+1;indices.push(a,b,a+1,b,b+1,a+1);}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();
  const mesh=new THREE.Mesh(geometry,mat);mesh.name=name;mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);return mesh;
 }
 function cord(name,points,radius=.0035,mat=trim){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(24,points.length*2),radius,5,false),mat);mesh.name=name;mesh.castShadow=true;group.add(mesh);return mesh;}
 const tau=Math.PI*2;
 const top=(u,v)=>{
  const t=u*tau,c=Math.cos(t),s=Math.sin(t);
  const neckline=1.1+.27*Math.pow(Math.abs(Math.sin(2*t)),1.2)-.12*Math.pow(Math.abs(c),8)+(s<0?.045:0);
  const hem=.39+.012*Math.sin(3*t);
  const y=hem+(neckline-hem)*v;
  const radius=.445-.06*Math.sin(v*Math.PI*.85);
  const waves=(.013*Math.sin(10*t+v*1.6)+.007*Math.sin(17*t-v*2.3))*(1-v*.5);
  const chest=.035*Math.exp(-Math.pow((v-.68)/.22,2));
  return [(radius+waves)*c,y,(.22+chest+waves*.8)*s+.012*Math.sin(4*t+v*5)];
 };
 surface('Camisole_draped_shell',top);
 for(const v of [0,.017,1])cord(v===1?'Bound_neckline':'Double_turned_hem',Array.from({length:145},(_,i)=>top(i/144,v)),v===1?.005:.003);
 for(const u of [0,.5]){cord('Side_seam',Array.from({length:81},(_,i)=>top(u,i/80)),.0035);for(let i=3;i<75;i+=2){cord('Topstitch', [top(u+.002,i/80),top(u+.002,(i+.55)/80)],.0011,thread);}}
 for(const sign of [-1,1]){
  const shoulder=[ [sign*.282,1.368,.177],[sign*.305,1.49,.13],[sign*.315,1.55,0],[sign*.304,1.48,-.13],[sign*.282,1.41,-.178] ];
  const curve=new THREE.CatmullRomCurve3(shoulder.map(p=>new THREE.Vector3(...p)));
  surface('Satin_shoulder_strap',(u,v)=>{const p=curve.getPoint(v);return [p.x+(u-.5)*.027,p.y,p.z];},8,64,trim);
  for(const off of [-.012,.012])cord('Strap_edge',Array.from({length:65},(_,i)=>{const p=curve.getPoint(i/64);return [p.x+off,p.y,p.z];}),.0018,thread);
 }
 const hip=(u,v)=>{const t=u*tau,r=.395+.068*Math.sin(v*Math.PI*.7);return [r*Math.cos(t),.34-v*.43,(.225+.025*v)*Math.sin(t)];};
 surface('Trousers_hip_yoke',hip,112,40);
 for(const v of [0,.035,.11])cord('Elastic_waist_seam',Array.from({length:129},(_,i)=>hip(i/128,v)),.0035,trim);
 for(const sign of [-1,1]){
  const leg=(u,v)=>{const t=u*tau;
   const rx=.228-.024*Math.sin(v*Math.PI)+.032*v*v;
   const rz=.25-.05*Math.sin(v*Math.PI)+.008*v;
   const fold=.009*Math.sin(t*9+v*1.4)+.005*Math.sin(t*15-v*3);
   const cx=sign*(.235+.026*v);
   return [cx+(rx+fold)*Math.cos(t),-.055-1.36*v+.012*Math.sin(t*4)*v,(rz+fold)*Math.sin(t)+.018*Math.sin(v*5)];
  };
  surface(sign<0?'Left_trouser_leg':'Right_trouser_leg',leg,96,112);
  for(const v of [.978,1])cord('Trouser_hem',Array.from({length:129},(_,i)=>leg(i/128,v)),.003,trim);
  const side=sign<0?.5:0;
  cord('Outer_leg_seam',Array.from({length:113},(_,i)=>leg(side,i/112)),.0028,trim);
  for(let i=4;i<108;i+=3)cord('Leg_topstitch',[leg(side+.002,i/112),leg(side+.002,(i+.75)/112)],.001,thread);
 }
 const tieLeft=[[0,.32,.238],[-.06,.25,.27],[-.13,.31,.265],[-.09,.36,.25],[0,.32,.238]];
 const tieRight=tieLeft.map(([x,y,z])=>[-x,y,z]);cord('Waist_tie_left',tieLeft,.006);cord('Waist_tie_right',tieRight,.006);
 cord('Waist_tie_tail',[[0,.32,.24],[.04,.19,.275],[.025,.03,.27]],.005);
 // Fine cloth normal detail created procedurally; not an invented replica of the printed floral artwork.
 const size=128,data=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=(y*size+x)*4;data[i]=128+Math.round(8*Math.sin(x*Math.PI));data[i+1]=128+Math.round(8*Math.cos(y*Math.PI));data[i+2]=254;data[i+3]=255;}
 const normal=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);normal.wrapS=normal.wrapT=THREE.RepeatWrapping;normal.repeat.set(18,18);normal.needsUpdate=true;fabric.normalMap=normal;fabric.normalScale.set(.12,.12);
 group.userData={source:'Front product photo DdnubdMNlyM',status:'Approximate visualization; not verified garment construction or fit',created:'2026-10-27'};
 return group;
}
