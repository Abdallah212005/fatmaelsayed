
document.querySelectorAll('.brand-gallery').forEach(gallery=>{
 const figures=[...gallery.querySelectorAll('.brand-art')];
 const positions=new Map(figures.map((figure,index)=>[figure,index]));
 const sortGallery=()=>gallery.append(...[...figures].sort((a,b)=>Number(b.classList.contains('wide'))-Number(a.classList.contains('wide'))||positions.get(a)-positions.get(b)));
 figures.forEach(figure=>{
  const image=figure.querySelector('img');
  if(!image)return;
  const setOrientation=()=>{figure.classList.toggle('wide',image.naturalWidth>image.naturalHeight);sortGallery()};
  if(image.complete)setOrientation();
  else{image.addEventListener('load',setOrientation,{once:true});image.addEventListener('error',setOrientation,{once:true})}
 });
});
const menuButton=document.querySelector('.burger'),navLinks=document.querySelector('.links');
menuButton.addEventListener('click',()=>{
 const expanded=menuButton.getAttribute('aria-expanded')==='true';
 menuButton.setAttribute('aria-expanded',String(!expanded));
 navLinks.classList.toggle('open',!expanded);
});
navLinks.addEventListener('click',event=>{
 if(event.target.closest('a')){
  menuButton.setAttribute('aria-expanded','false');
  navLinks.classList.remove('open');
 }
});
const hh=document.querySelector('.hero h1'),ht=hh.textContent;
hh.setAttribute('aria-label',ht);
hh.innerHTML=[...ht].map((c,i)=>`<span class="c" aria-hidden="true" style="--i:${i}">${c===' '?'&nbsp;':c}</span>`).join('');
const hero=document.querySelector('.hero');
if(document.documentElement.classList.contains('js')){
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const section=e.target.closest('.has-section-transition');if(section&&!section.classList.contains('revealed'))(section._pend=section._pend||[]).push(e.target);else e.target.classList.add('in');io.unobserve(e.target)}),{threshold:.2,rootMargin:'0px 0px -6% 0px'});
 /* project images wait under the curtain until it lifts, then reveal in a stagger */
 const artIO=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const a=e.target,sec=a.closest('.brand-work');artIO.unobserve(a);if(sec&&!sec.classList.contains('revealed'))(sec._pend=sec._pend||[]).push(a);else a.classList.add('in')}),{threshold:0,rootMargin:'0px 0px -10% 0px'});
 const LIFT=1550;
 const sectionIO=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const s=e.target;sectionIO.unobserve(s);s.classList.add('section-in');setTimeout(()=>{s.classList.add('revealed');const h=s.querySelector('.brand-head');if(h)h.classList.add('in');(s._pend||[]).forEach(a=>a.classList.add('in'));s._pend=[]},LIFT)}),{threshold:0,rootMargin:'0px 0px -35% 0px'});
 const rv=(s,c,st=90)=>document.querySelectorAll(s).forEach((e,i)=>{e.classList.add('rv',c);e.style.setProperty('--d',(i%6)*st+'ms');io.observe(e)});
 rv('.about .tag,.about h2,.about p,.about hr,.services .tag,.services h2,.services>div>p,.cta.skills .cta-kicker,.cta.skills h2,.cta.skills>div>p,.certificates-head,.contact>.tag,.contact h2,.contact>p,footer>*:not(.hand)','up');
 rv('.traits div','up',130);
 rv('.svc','left',110);rv('.contact li','right',130);
 const brandMotions=['pop','left','curtain','right','wr','up','drop'];
 const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const sections=[...document.querySelectorAll('.sec:not(.hero):not(footer)')],N=String(sections.length).padStart(2,'0');
 sections.forEach((section,index)=>{
  const motion=brandMotions[index%brandMotions.length];
  const heading=section.querySelector('.brand-head');
  const name=(section.querySelector('.brand-title,h1,h2')?.textContent||'').replace(/\s+/g,' ').trim();
  const num=String(index+1).padStart(2,'0');
  const step=Math.min(26,320/Math.max(name.length,1));let ci=0;
  const words=name.split(/\s+/).map(w=>'<span class="w">'+[...w].map(c=>'<i style="--d:'+Math.round(ci++*step)+'ms">'+esc(c)+'</i>').join('')+'</span>').join(' ');
  const layer=document.createElement('span');
  layer.className='section-transition-title';
  layer.setAttribute('aria-hidden','true');
  layer.innerHTML='<span class="st-curtain"><span class="st-num">'+num+'</span><span class="st-meta"><b>'+num+'</b> / '+N+' &mdash; Portfolio Section</span><span class="st-name">'+words+'</span><span class="st-rule"></span></span>';
  section.classList.add('has-section-transition');
  section.append(layer);
  if(heading){heading.dataset.revealMotion=brandMotions[(index+2)%brandMotions.length];heading.classList.add('rv',heading.dataset.revealMotion)}
  sectionIO.observe(section);
  section.querySelectorAll('.brand-art').forEach((art,artIndex)=>{
   art.dataset.revealMotion=motion;
   art.classList.add('rv',motion);
   art.style.setProperty('--d',(artIndex%6)*110+'ms');
   artIO.observe(art);
  });
 });
 rv('.certificate-card','up',110);
 rv('.pol','drop',0);
 rv('.about .hand,.services .hand,.contact .hand,footer .hand','wr',0);
 rv('.cta h2','curtain',0);
 document.querySelectorAll('.bottom i').forEach(e=>io.observe(e));
 const par=[...document.querySelectorAll('.cta .slot')];let tk=0;
 addEventListener('scroll',()=>{if(tk)return;tk=requestAnimationFrame(()=>{tk=0;
  document.documentElement.style.setProperty('--sp',scrollY/(document.documentElement.scrollHeight-innerHeight));
  par.forEach(el=>{const r=el.parentElement.getBoundingClientRect();el.style.transform=`translateY(${(r.top+r.height/2-innerHeight/2)*-.1}px)`})})},{passive:true});
}
/* Keyboard: ↓ / ↑ jump one full section (Space, PageDown and the mouse wheel still scroll normally) */
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
 let lock=0;
 const tops=()=>{const out=[];document.querySelectorAll('.sec').forEach(el=>{const t=Math.round(el.getBoundingClientRect().top+scrollY);if(!out.some(v=>Math.abs(v-t)<8))out.push(t)});return out.sort((a,b)=>a-b)};
 const go=(top,smooth)=>{if(smooth)scrollTo({top,behavior:'smooth'});else{const d=document.documentElement;d.style.scrollBehavior='auto';scrollTo(0,top);d.style.scrollBehavior=''}};
 addEventListener('keydown',e=>{
  if((e.key!=='ArrowDown'&&e.key!=='ArrowUp')||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||e.defaultPrevented)return;
  const t=e.target;if(t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))return;
  const y=scrollY,max=document.documentElement.scrollHeight-innerHeight,list=tops();
  let dest;
  if(e.key==='ArrowDown'){dest=list.find(v=>v>y+24);if(dest==null){if(y<max-24)dest=max;else return}}
  else{for(let i=list.length-1;i>=0;i--)if(list[i]<y-24){dest=list[i];break}if(dest==null)return}
  e.preventDefault();
  if(e.repeat||Date.now()<lock)return;
  lock=Date.now()+550;
  dest=Math.max(0,Math.min(dest,max));
  go(dest,!reduce&&Math.abs(dest-y)<=innerHeight*2.2);
 });
})();
