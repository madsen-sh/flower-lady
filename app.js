(() => {
 'use strict';
 const $ = (s,root=document) => root.querySelector(s);
 const $$ = (s,root=document) => [...root.querySelectorAll(s)];
 const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
 const loader = $('#loader');
 let loaderTimer;
 const dismissLoader = () => { loader.hidden = true; clearTimeout(loaderTimer); try { sessionStorage.setItem('flowerlady-visited','1'); } catch {} };
 let visited=false;try {visited=!!sessionStorage.getItem('flowerlady-visited');} catch {}
 if (!visited && !reduce.matches && document.fonts.status !== 'loaded') {
  loader.hidden=false;
  loaderTimer=setTimeout(dismissLoader,2500);
  document.fonts.ready.then(dismissLoader, dismissLoader);
 }
 $('#skip-loader').addEventListener('click',dismissLoader);
 const menu=$('#menu-button'),nav=$('#navigation');
 const closeMenu=()=>{nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','باز کردن منو');};
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'بستن منو':'باز کردن منو');});
 $$('a',nav).forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
 document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
 const media={fit:['#i-fit','نمای واقعی لباس روی مدل'],stretch:['#i-stretch','ویدئوی واقعی کشسانی پارچه'],weight:['#i-fabric','نمای نزدیک بافت مقابل نور ثابت'],care:['#i-care','برچسب واقعی نگهداری لباس']};
 const tabs=$$('[role=tab]');
 function selectTab(tab,focus=false){
  tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;$('#'+t.getAttribute('aria-controls')).hidden=!active;});
  const [icon,label]=media[tab.dataset.tab];$('#lab-media-icon').setAttribute('href',icon);$('#lab-media-label').textContent='تصویر مرجع محصول / '+tab.textContent.trim();
  if(focus)tab.focus();
 }
 tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>selectTab(tab));
  tab.addEventListener('keydown',e=>{let n=index;if(e.key==='ArrowLeft')n=(index+1)%tabs.length;else if(e.key==='ArrowRight')n=(index-1+tabs.length)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();selectTab(tabs[n],true);});
 });
 const dialog=$('#compare-dialog');
 $('#compare-open').addEventListener('click',()=>dialog.showModal());
 ['#compare-close','#compare-done'].forEach(s=>$(s).addEventListener('click',()=>dialog.close()));
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>$('#compare-open').focus());
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){if(!reduce.matches)entry.target.classList.add('is-entering');observer.unobserve(entry.target);}});},{threshold:0});$$('.reveal').forEach(el=>observer.observe(el));}
})();
