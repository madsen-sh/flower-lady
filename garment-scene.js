import * as THREE from 'three';
import {RoomEnvironment} from './vendor/RoomEnvironment.js';
import {buildGarment} from './garment-model.js?v=2';
const host=document.querySelector('#garment-canvas'),story=document.querySelector('.scroll-story');
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});}catch{
 document.querySelector('#model-status').textContent='نمایش سه‌بعدی روی این دستگاه پشتیبانی نمی‌شود؛ تصویر واقعی محصول در دسترس است.';
 document.querySelector('#model-fallback').hidden=false;
}
if(renderer){
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x38322e);
 renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.5:2));renderer.setSize(host.clientWidth,host.clientHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;host.append(renderer.domElement);
 renderer.domElement.setAttribute('aria-label','مدل سه‌بعدی بازسازی‌شده ست تاپ و شلوار؛ برای چرخاندن از دکمه‌ها استفاده کنید');renderer.domElement.setAttribute('role','img');
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();const environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;room.dispose();pmrem.dispose();
 const camera=new THREE.PerspectiveCamera(31,host.clientWidth/host.clientHeight,.01,60);camera.position.set(0,.25,6.6);
 const garment=buildGarment();scene.add(garment);
 const key=new THREE.DirectionalLight(0xffeee1,2.5);key.position.set(3,5,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-3;key.shadow.camera.right=3;key.shadow.camera.top=3;key.shadow.camera.bottom=-3;key.shadow.normalBias=.025;scene.add(key);
 const fill=new THREE.DirectionalLight(0xe8efff,1.1);fill.position.set(-4,1,2);scene.add(fill);const rim=new THREE.DirectionalLight(0xfff4e8,2);rim.position.set(1,3,-3);scene.add(rim);
 const floor=new THREE.Mesh(new THREE.CircleGeometry(5,80),new THREE.MeshStandardMaterial({color:0x49413a,roughness:.9}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.47;floor.receiveShadow=true;scene.add(floor);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.88,.002,5,100),new THREE.MeshBasicMaterial({color:0xa28b64}));ring.rotation.x=-Math.PI/2;ring.position.y=-1.458;scene.add(ring);
 const marker=new THREE.Mesh(new THREE.SphereGeometry(.013,16,16),new THREE.MeshBasicMaterial({color:0x755324}));scene.add(marker);
 const steps=[
 {title:'فرم کلی، از همه طرف.',text:'یک بازسازی سه‌بعدی از ست تاپ و شلوار، با الهام از تصویر واقعی محصول. فرم و اندازه‌ها تقریبی‌اند.',tag:'01 / نمای کامل',rotation:0,cam:[0,.16,6.6],target:[0,.08,0],point:[.3,.6,.25]},
 {title:'بچرخ؛ پشت لباس را ببین.',text:'اسکرول، همان مدل را می‌چرخاند. پشت لباس بر اساس ساختار متعارف بازسازی شده و هنوز توسط برند تأیید نشده است.',tag:'02 / پشت لباس',rotation:Math.PI,cam:[0,.4,5.8],target:[0,.15,0],point:[.28,1.25,-.18]},
 {title:'نزدیک‌تر به یقه و بندها.',text:'دوربین به لبه یقه و بندهای مدل نزدیک می‌شود. این جزئیات هندسه سه‌بعدی دارند، نه تصویر تخت.',tag:'03 / یقه و بند',rotation:Math.PI*2,cam:[.1,1.5,2.25],target:[0,1.18,0],point:[.28,1.39,.18]},
 {title:'مسیر درز و دوخت.',text:'درز کناری و ردیف دوخت مدل را از نزدیک ببین. نوع و تراکم دوخت، فعلاً نمایش مفهومی است.',tag:'04 / دوخت',rotation:Math.PI*2-.78,cam:[.1,.85,1.8],target:[.27,.72,0],point:[.4,.72,.03]},
 {title:'افت پارچه و دم‌پا.',text:'نور و سایه روی چین‌ها و لبه شلوار حرکت می‌کنند. این بازسازی بصری، آزمون فیزیکی جنس یا تضمین تن‌خور نیست.',tag:'05 / پارچه و دم‌پا',rotation:Math.PI*2-.25,cam:[.1,-.8,2.8],target:[0,-.88,0],point:[.47,-1.34,.08]},
 {title:'حالا، تصویر واقعی محصول.',text:'برای دیدن طرح چاپی اصلی، قیمت و شرایط سفارش به محصول واقعی برگرد. رنگ و طرح مدل، بازسازی تقریبی است.',tag:'06 / انتخاب',rotation:Math.PI*2,cam:[0,.2,6.6],target:[0,.08,0],point:[.3,.6,.25]}
 ];
 let manual=null,rotationOffset=0,visible=true,current=-1,raf=0,smoothed=0,desired=0;
 const buttons=[...document.querySelectorAll('[data-model-step]')];
 const lerp=THREE.MathUtils.lerp;const ease=t=>t*t*(3-2*t);const look=new THREE.Vector3(),position=new THREE.Vector3();
 function updateText(i){if(i===current)return;current=i;const s=steps[i];document.querySelector('#scene-kicker').textContent=s.tag;document.querySelector('#scene-title').textContent=s.title;document.querySelector('#scene-description').textContent=s.text;document.querySelector('#model-detail-label').textContent=s.tag;buttons.forEach((b,n)=>{b.classList.toggle('is-active',n===i);b.setAttribute('aria-pressed',String(n===i));});}
 function frame(){raf=0;if(!visible)return;smoothed=reduce.matches?desired:lerp(smoothed,desired,.12);if(Math.abs(smoothed-desired)<.0001)smoothed=desired;
  const val=Math.min(5,Math.max(0,smoothed*5)),i=Math.min(4,Math.floor(val)),t=ease(val-i),a=steps[i],b=steps[i+1];
  garment.rotation.y=lerp(a.rotation,b.rotation,t)+rotationOffset;for(let k=0;k<3;k++){position.setComponent(k,lerp(a.cam[k],b.cam[k],t));look.setComponent(k,lerp(a.target[k],b.target[k],t));}camera.position.copy(position);camera.lookAt(look);
  const point=steps[Math.round(val)].point;marker.position.set(...point).applyAxisAngle(new THREE.Vector3(0,1,0),garment.rotation.y);marker.visible=Math.round(val)>1&&Math.round(val)<5;
  updateText(Math.round(val));renderer.render(scene,camera);if(smoothed!==desired)requestFrame();
 }
 function requestFrame(){if(!raf&&visible)raf=requestAnimationFrame(frame);}
 function onScroll(){manual=null;const r=story.getBoundingClientRect(),range=Math.max(1,story.offsetHeight-innerHeight);desired=reduce.matches?0:THREE.MathUtils.clamp(-r.top/range,0,1);requestFrame();}
 addEventListener('scroll',onScroll,{passive:true});
 buttons.forEach((b,index)=>b.addEventListener('click',()=>{manual=index;desired=index/5;requestFrame();}));
 document.querySelector('#rotate-left').addEventListener('click',()=>{rotationOffset-=Math.PI/6;requestFrame();});document.querySelector('#rotate-right').addEventListener('click',()=>{rotationOffset+=Math.PI/6;requestFrame();});document.querySelector('#model-reset').addEventListener('click',()=>{rotationOffset=0;desired=0;smoothed=0;requestFrame();});
 const resize=new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);requestFrame();});resize.observe(host);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){onScroll();requestFrame();}},{rootMargin:'100px'}).observe(host);
 reduce.addEventListener('change',()=>{desired=0;smoothed=0;requestFrame();});
 document.querySelector('#model-status').textContent='مدل سه‌بعدی فعال است • با اسکرول جزئیات را ببین';
 onScroll();requestFrame();
 addEventListener('pagehide',()=>{resize.disconnect();if(raf)cancelAnimationFrame(raf);renderer.dispose();environment.dispose();});
}
