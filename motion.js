(() => {
 'use strict';
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),$=s=>document.querySelector(s);
 const items=[...document.querySelectorAll('.lab-media,.post-layout,.product-card,.closing h2,.intro h2')];
 const products=[
 {keys:['barbie','باربی'],name:'ست Barbie',image:'5c263cf45971ae01.jpg',post:'reel/DeJMZGENb5_/'},
 {keys:['گل','گلدار','گل‌دار'],name:'ست گل‌دار',image:'fdabeb71c17b5598.jpg',post:'reel/DdnubdMNlyM/'},
 {keys:['اویشو','اويشو','oysho'],name:'ست اویشو',image:'24dd0d3cee0f8ffd.jpg',post:'p/Dda9xUXDeLJ/'},
 {keys:['name','اسم','نام'],name:'ست NAME',image:'a71f2c6a73314c29.jpg',post:'p/DbAXLV7jbzo/'}
 ];
 $('#finder-form').addEventListener('submit',e=>{
  e.preventDefault();const input=$('#product-code'),value=input.value.trim().toLowerCase(),status=$('#finder-status'),results=$('#finder-results');results.replaceChildren();
  if(!value){status.textContent='نام یا کلیدواژه پست را وارد کن.';input.setAttribute('aria-invalid','true');input.focus();return;}
  input.removeAttribute('aria-invalid');const matches=products.filter(p=>p.keys.some(k=>k.includes(value)||value.includes(k)));
  status.textContent=matches.length?'محصول مرتبط پیدا شد؛ برای جزئیات روی تصویر بزن.':'در پست‌های متصل‌شده نتیجه‌ای پیدا نشد؛ پیج را ببین یا Barbie، اویشو و NAME را امتحان کن.';
  matches.forEach(p=>{const a=document.createElement('a');a.href='https://www.instagram.com/flowerladybook/'+p.post;a.target='_blank';a.rel='noopener noreferrer';const img=document.createElement('img');img.src='assets/images/'+p.image;img.alt=p.name;const title=document.createElement('span');title.textContent=p.name+' — مشاهده پست اصلی';a.append(img,title);results.append(a);});
 });
 $('#product-code').addEventListener('input',e=>e.target.removeAttribute('aria-invalid'));
 let requested=false;
 const clamp=n=>Math.max(0,Math.min(1,n));
 function render(){requested=false;if(reduce.matches)return;const vh=innerHeight,y=scrollY,max=document.documentElement.scrollHeight-vh;document.documentElement.style.setProperty('--page-progress',String(max>0?y/max:0));document.documentElement.style.setProperty('--pattern-shift',`${-(y*.08)%280}px`);
  const hero=$('.hero'),track=$('.hero-scroll'),r=track.getBoundingClientRect(),p=clamp(-r.top/Math.max(1,track.offsetHeight-vh));if(r.bottom>0&&r.top<vh){hero.style.setProperty('--hero-type-x',`${p*-120}px`);hero.style.setProperty('--hero-photo-zoom',String(1+p*.32));hero.style.setProperty('--hero-photo-y',`${-p*30}px`);hero.style.setProperty('--hero-title-y',`${-p*24}px`);hero.style.setProperty('--hero-radius',`${24+p*55}px`);}
  items.forEach(el=>{const r=el.getBoundingClientRect();if(r.top<vh&&r.bottom>0){const p=clamp((vh-r.top)/(vh+r.height));el.style.setProperty('--section-drift',`${(p-.5)*-36}px`);el.style.setProperty('--section-scale',String(.97+p*.05));}});

 }
 function schedule(){if(!requested){requested=true;requestAnimationFrame(render);}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduce.addEventListener('change',()=>{if(reduce.matches){document.documentElement.style.setProperty('--pattern-shift','0px');}schedule();});schedule();
})();
