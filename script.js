(function(){
const $=id=>document.getElementById(id);
const ITEMS=[
{n:"Lagan (ko'k)",g:"oshxona",c:"#2f6fd6",d:"Palov uchun katta, ko'k naqshli lagan.",m:"Diametri 40 sm. Sirti oziq-ovqat uchun xavfsiz."},
{n:"Kosa",g:"oshxona",c:"#36c2b4",d:"Sho'rva va mastava uchun chuqur kosa.",m:"Issiqni uzoq saqlaydi, mikroto'lqinli pechga yaramaydi."},
{n:"Kuza",g:"bezak",c:"#c46b3f",d:"Bo'yni uzun, ikki quloqli kuza.",m:"Balandligi 35 sm, uy bezagi sifatida eng ko'p olinadi."},
{n:"Devor likopchasi",g:"bezak",c:"#d8a93a",d:"Devorga osiladigan naqshli likopcha.",m:"Orqasiga ilgak o'rnatilgan, har birining naqshi alohida."},
{n:"Choynak",g:"choy",c:"#2f6fd6",d:"Qopqoqli, jo'mragi chiroyli choynak.",m:"Hajmi 0,8 litr, quyganda tomchi qoldirmaydi."},
{n:"Piyola to'plami",g:"choy",c:"#36c2b4",d:"Oltita piyola va likopcha.",m:"Bir xil rangdagi to'plam, sovg'a sifatida qadoqlanadi."}
];
const grid=$('grid');
function render(f){
 grid.innerHTML='';
 ITEMS.filter(i=>f==='all'||i.g===f).forEach(i=>{
  const b=document.createElement('button');b.className='card';b.style.setProperty('--c',i.c);
  b.innerHTML='<h3>'+i.n+'</h3><p>'+i.d+'</p><p class="more">'+i.m+'</p>';
  b.onclick=()=>b.classList.toggle('open');grid.appendChild(b);
 });
}
render('all');
document.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{
 document.querySelectorAll('.chip').forEach(x=>x.classList.remove('on'));c.classList.add('on');render(c.dataset.f);
});
ITEMS.forEach(i=>$('itemSel').add(new Option(i.n,i.n)));
["Firuza ko'k","Kobalt ko'k","Yashil","Oq-ko'k naqsh","Tilla sariq"].forEach(g=>$('glazeSel').add(new Option(g,g)));

/* scroll swatch */
const steps=[...document.querySelectorAll('#steps li')];
function onScroll(){
 let cur=steps[0];
 steps.forEach(li=>{const r=li.getBoundingClientRect();if(r.top<innerHeight*.6){li.classList.add('on');cur=li}else li.classList.remove('on')});
 $('sw').style.background=cur.dataset.c;$('stg').textContent=cur.dataset.n;$('tmp').textContent=cur.dataset.t+'°';
}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* volume calc */
function calc(){
 const h=+$('h').value,d=+$('d').value,k=+$('shape').value;$('o1').textContent=h;$('o2').textContent=d;
 const l=Math.PI*Math.pow(d/2,2)*h*k/1000;
 $('lt').textContent=l.toFixed(1);
 $('cups').textContent='≈ '+Math.round(l*1000/200)+' ta 200 ml lik piyola';
}
['h','d','shape'].forEach(i=>$(i).addEventListener('input',calc));calc();

/* form */
$('form').addEventListener('submit',e=>{
 e.preventDefault();const f=e.target;let ok=true;
 const rules={
  name:v=>v.trim().length>=2||"Ismingizni kiriting",
  phone:v=>(v.replace(/\D/g,'').length===12&&v.replace(/\D/g,'').startsWith('998'))||"Telefon +998 bilan 12 raqam bo'lishi kerak",
  qty:v=>(+v>=1&&+v<=50)||"1 dan 50 gacha son kiriting"};
 Object.keys(rules).forEach(k=>{
  const el=f.elements[k],r=rules[k](el.value),msg=r===true?'':r;
  el.classList.toggle('bad',!!msg);el.parentElement.querySelector('em').textContent=msg;if(msg)ok=false;
 });
 $('ok').textContent=ok?f.elements.name.value.trim()+', buyurtmangiz qabul qilindi. Ustamiz tez orada bog\'lanadi.':'';
 if(ok)f.reset();
});

/* pottery wheel */
const cv=$('wheel'),cx=cv.getContext('2d'),still=matchMedia('(prefers-reduced-motion:reduce)').matches;
const N=22;let W,H,rad=[],tgt=[],ang=0;
for(let i=0;i<N;i++){const u=i/(N-1);const r=.32+.2*Math.sin(Math.PI*Math.pow(u,.8))-.12*Math.exp(-Math.pow((u-.8)*6,2))+(u>.9?.04:0);rad.push(r);tgt.push(r)}
function resize(){const d=devicePixelRatio||1;W=cv.clientWidth;H=cv.clientHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0)}
function shape(e){
 const b=cv.getBoundingClientRect(),p=e.touches?e.touches[0]:e;
 const x=p.clientX-b.left,y=p.clientY-b.top,top=H*.2,bot=H*.78;
 if(y<top||y>bot)return;
 const u=(y-top)/(bot-top),i=Math.round(u*(N-1)),half=Math.min(W,H)*.5;
 const r=Math.max(.14,Math.min(.62,Math.abs(x-W/2)/half));
 for(let k=-3;k<=3;k++){const j=i+k;if(j>=0&&j<N)tgt[j]+=(r-tgt[j])*(1-Math.abs(k)/4)}
}
cv.addEventListener('mousemove',shape);cv.addEventListener('touchmove',shape,{passive:true});
addEventListener('resize',resize);resize();
function draw(){
 cx.clearRect(0,0,W,H);
 const S=Math.min(W,H)*.5,cxm=W/2,top=H*.2,bot=H*.78,rows=120;
 for(let i=0;i<N;i++)rad[i]+=(tgt[i]-rad[i])*.12;
 /* wheel base */
 cx.fillStyle='#182125';cx.beginPath();cx.ellipse(cxm,bot+14,S*.75,18,0,0,6.28);cx.fill();
 cx.fillStyle='#2c3a3f';cx.fillRect(cxm-8,bot+14,16,H-bot-14);
 const prof=y=>{const u=(y-top)/(bot-top)*(N-1),i=Math.floor(u),f=u-i;return(rad[i]*(1-f)+(rad[Math.min(i+1,N-1)])*f)*S};
 for(let k=0;k<rows;k++){
  const y=top+(bot-top)*k/rows,h=(bot-top)/rows+1,r=prof(y);
  const g=cx.createLinearGradient(cxm-r,0,cxm+r,0);
  g.addColorStop(0,'#0c3a6b');g.addColorStop(.35,'#2f6fd6');g.addColorStop(.6,'#36c2b4');g.addColorStop(1,'#0d2a4a');
  cx.fillStyle=g;cx.fillRect(cxm-r,y,2*r,h);
  /* ornament dots rotating */
  if(k%10===5)for(let j=0;j<7;j++){
   const a=ang+j*Math.PI*2/7,c=Math.cos(a);
   if(c>0){cx.fillStyle='rgba(239,230,214,'+(.3+.6*c)+')';cx.beginPath();cx.ellipse(cxm+Math.sin(a)*r,y+h/2,3.5*c+.5,3.5,0,0,6.28);cx.fill()}
  }
 }
 cx.strokeStyle='#efe6d655';cx.lineWidth=2;cx.beginPath();
 cx.ellipse(cxm,top,prof(top),7,0,0,6.28);cx.stroke();
 if(!still){ang+=.025;requestAnimationFrame(draw)}
}
draw();
})();
