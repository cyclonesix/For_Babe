'use strict';
const $ = s => document.querySelector(s);
const photos = [
 ['mirror-cuddle.png','แค่มีเบ้บอยู่ใกล้ ๆ วันธรรมดาของเค้าก็กลายเป็นวันที่อยากเก็บไว้แล้ว'],
 ['mirror-hug.png','กอดของเบ้บเป็นที่ที่เค้าอยากกลับไปหาเสมอ เหนื่อยแค่ไหนก็อยากกอดแบบนี้นาน ๆ'],
 ['soft-selfie.png','ไม่ต้องเป็นวันพิเศษหรอก แค่เป็นวันที่มีเบ้บ เค้าก็ชอบแล้ว'],
 ['night-kiss.png','ก่อนนอนเค้าอยากบอกรักเบ้บ แล้วตื่นมาก็ยังอยากบอกคำเดิมอีก'],
 ['our-little-moment.png','บางโมเมนต์อาจจะเล็กนิดเดียว แต่พอมีเบ้บอยู่ด้วย เค้าก็จำได้ดีทุกครั้ง'],
 ['funny-filter.png','อยู่กับเบ้บแล้วเค้าเป็นตัวเองได้เต็มที่ จะตลกแค่ไหนก็อยากหัวเราะไปด้วยกัน'],
 ['funny-smile.png','ขอให้เค้าได้เห็นรอยยิ้มของเบ้บแบบนี้ไปนาน ๆ เดือนหน้า ปีหน้า ก็ยังอยากมีเบ้บอยู่ข้าง ๆ']
];
const audio=$('#audio'); audio.volume=.4;
let opened=false, currentPhoto=0, lastPhotoButton=null;
function musicState(){ $('#play').textContent=audio.paused?'▶':'Ⅱ';$('#play').setAttribute('aria-label',audio.paused?'เล่นเพลง':'หยุดเพลงชั่วคราว');$('#music-status').textContent=audio.paused?'พักเพลงไว้ก่อน':'กำลังเล่น · วนให้ฟังเรื่อย ๆ'; }
async function playMusic(){try{await audio.play();musicState();}catch(e){$('#music-status').textContent='แตะ ▶ เพื่อเริ่มเพลง';}}
audio.addEventListener('play',musicState);audio.addEventListener('pause',musicState);audio.addEventListener('error',()=>{$('#music-status').textContent='เปิดเพลงไม่ได้ ลองโหลดหน้าใหม่';});
$('#play').addEventListener('click',()=>audio.paused?playMusic():audio.pause());
function setVolume(v){v=Math.max(0,Math.min(100,Number(v)));audio.volume=v/100;$('#volume').value=v;$('#volume-value').textContent=v+'%';}
$('#volume').addEventListener('input',e=>setVolume(e.target.value));$('#minus').addEventListener('click',()=>setVolume(Number($('#volume').value)-10));$('#plus').addEventListener('click',()=>setVolume(Number($('#volume').value)+10));
function hearts(n=18){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;for(let i=0;i<n;i++){const h=document.createElement('span');h.className='heart';h.textContent=i%3?'♡':'♥';h.style.left=Math.random()*100+'%';h.style.fontSize=(15+Math.random()*24)+'px';h.style.setProperty('--duration',(4+Math.random()*3)+'s');h.style.setProperty('--drift',(-80+Math.random()*160)+'px');h.style.animationDelay=Math.random()*.9+'s';$('#petals').append(h);setTimeout(()=>h.remove(),8500);}}
function showPanel(id){document.querySelectorAll('.panel').forEach(p=>p.hidden=p.id!==id);document.querySelectorAll('.tab').forEach(t=>{const active=t.dataset.panel===id;t.classList.toggle('active',active);if(active)t.setAttribute('aria-current','step');else t.removeAttribute('aria-current');});window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});const heading=$('#'+id+' h2');heading.tabIndex=-1;heading.focus({preventScroll:true});}
$('#open').addEventListener('click',()=>{opened=true;playMusic();$('#intro').hidden=true;$('#story').hidden=false;showPanel('anniversary');hearts(24);});
document.querySelectorAll('[data-panel]').forEach(b=>b.addEventListener('click',()=>showPanel(b.dataset.panel)));document.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>showPanel(b.dataset.next)));
$('.brand').addEventListener('click',e=>{e.preventDefault();$('#intro').hidden=false;$('#story').hidden=true;window.scrollTo({top:0});$('#open').focus();});
function renderPhoto(){const [file,caption]=photos[currentPhoto];$('#full-photo').src='assets/'+file;$('#full-photo').alt=caption;$('#full-caption').textContent=caption+' ♡  '+(currentPhoto+1)+' / '+photos.length;}
let momentIndex=0;
function renderMoment(animate=true){
 const [file,quote]=photos[momentIndex];
 $('#moment-image').src='assets/'+file;$('#moment-image').alt=quote;
 $('#moment-quote').textContent=quote;
 $('#moment-count').textContent=String(momentIndex+1).padStart(2,'0')+' / '+String(photos.length).padStart(2,'0');
 $('#memory-stage').setAttribute('aria-label','โมเมนต์ที่ '+(momentIndex+1)+' จาก '+photos.length);
 $('#moment-prev').disabled=momentIndex===0;
 $('#moment-next').textContent=momentIndex===photos.length-1?'อ่านสิ่งที่เค้าอยากบอก ♡':'โมเมนต์ถัดไป ♡';
 document.querySelectorAll('.moment-dot').forEach((b,i)=>{b.setAttribute('aria-current',i===momentIndex?'true':'false');});
 if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches){$('#moment-image').animate([{opacity:.2,transform:'scale(.98)'},{opacity:1,transform:'scale(1)'}],{duration:650,easing:'ease-out'});$('#moment-quote').animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:750,easing:'ease-out'});}
}
function moveMoment(delta){const next=momentIndex+delta;if(next<0)return;if(next>=photos.length){showPanel('letter');return;}momentIndex=next;renderMoment();}
photos.forEach((p,i)=>{const b=document.createElement('button');b.className='moment-dot';b.setAttribute('aria-label','ดูโมเมนต์ที่ '+(i+1));b.addEventListener('click',()=>{momentIndex=i;renderMoment();});$('#moment-dots').append(b);});
$('#moment-prev').addEventListener('click',()=>moveMoment(-1));$('#moment-next').addEventListener('click',()=>moveMoment(1));
$('#memory-photo').addEventListener('click',()=>{lastPhotoButton=$('#memory-photo');currentPhoto=momentIndex;renderPhoto();$('#lightbox').showModal();});
$('#memory-stage').addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();moveMoment(1);}if(e.key==='ArrowLeft'){e.preventDefault();moveMoment(-1);}});
let touchStart=null;
$('#memory-photo').addEventListener('touchstart',e=>{touchStart={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};},{passive:true});
$('#memory-photo').addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)moveMoment(dx<0?1:-1);touchStart=null;},{passive:true});
renderMoment(false);
$('#close').addEventListener('click',()=>$('#lightbox').close());$('#lightbox').addEventListener('close',()=>lastPhotoButton?.focus());$('#prev-photo').addEventListener('click',()=>{currentPhoto=(currentPhoto+photos.length-1)%photos.length;momentIndex=currentPhoto;renderMoment(false);renderPhoto();});$('#next-photo').addEventListener('click',()=>{currentPhoto=(currentPhoto+1)%photos.length;momentIndex=currentPhoto;renderMoment(false);renderPhoto();});$('#lightbox').addEventListener('keydown',e=>{if(e.key==='ArrowRight')$('#next-photo').click();if(e.key==='ArrowLeft')$('#prev-photo').click();});$('#lightbox').addEventListener('click',e=>{if(e.target===$('#lightbox')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
$('#love').addEventListener('click',()=>{hearts(38);$('#love-reply').textContent='ตกลงแล้วนะ… เดือนหน้า ปีหน้า ก็อยู่ข้างกันแบบนี้นะ ♡';$('#love').textContent='รักเบ้บมากขึ้นอีกแล้ว ♡';});
