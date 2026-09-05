export type Status = 'ready' | 'playing' | 'paused' | 'over' | 'won';
export type Obstacle = { lane: number; z: number; type: 'hole' | 'barrier' | 'repair' | 'police'; done?: boolean };
export type GameState = { status: Status; lane: number; visualLane: number; speed: number; distance: number; health: number; score: number; dodged: number; holes: number; checkpoints: number; elapsed: number; spawn: number; wave: number; travel: number; hit: number; message: string; messageTime: number; objects: Obstacle[]; brake: boolean; throttle: boolean };
export const fresh = (): GameState => ({ status:'ready',lane:1,visualLane:1,speed:0,distance:0,health:3,score:0,dodged:0,holes:0,checkpoints:0,elapsed:0,spawn:1.8,wave:0,travel:0,hit:0,message:'',messageTime:0,objects:[],brake:false,throttle:false });
export const stages = ['Girne çıkışı','Boğaz geçidi','Gönyeli yolu','Lefkoşa'];
export const stageIndex = (distance: number) => distance < 8 ? 0 : distance < 18 ? 1 : distance < 27 ? 2 : 3;
export const difficulty = (distance: number) => ({
  level: Math.min(4, 1 + Math.floor(distance / 8)),
  maxSpeed: Math.min(152, 82 + distance * 2.35),
  spawnDelay: Math.max(1.55, 3 - distance * .05),
});
export function move(s:GameState,dir:number) { if(s.status==='playing') s.lane=Math.max(0,Math.min(2,s.lane+dir)); }
export function step(s:GameState,dt:number,random:()=>number=Math.random) {
 if(s.status!=='playing') return;
 s.elapsed+=dt; s.hit=Math.max(0,s.hit-dt);s.messageTime=Math.max(0,s.messageTime-dt);
 // Separate pedals: accelerate, coast when released, and brake all the way to zero.
 // Braking wins when both pedals are held, including with two fingers.
 s.speed=Math.max(0,Math.min(difficulty(s.distance).maxSpeed,s.speed+dt*(s.brake?-90:s.throttle?42:-8)));
 s.visualLane+=(s.lane-s.visualLane)*Math.min(1,dt*13);
 s.distance=Math.min(30,s.distance+s.speed*dt/300);s.travel+=s.speed*dt/120;
 s.spawn-=dt*s.speed/80;
 if(s.spawn<=0){
   s.wave++;s.spawn=difficulty(s.distance).spawnDelay;
   if(s.wave%6===0) s.objects.push({lane:1,z:1,type:'police'});
   else { const safe=Math.floor(random()*3); const lane=(safe+1+Math.floor(random()*2))%3;
     s.objects.push({lane,z:1,type:s.wave%3===0?'barrier':'hole'});
     if(s.distance>7&&s.wave%2===0)s.objects.push({lane:3-safe-lane,z:1,type:'barrier'});
     if(s.wave%4===0)s.objects.push({lane:safe,z:1,type:'repair'});
   }
 }
 for(const o of s.objects){o.z-=dt*s.speed/340;
   if(o.z<=.08&&!o.done){o.done=true;
     const inLane=Math.abs(s.visualLane-o.lane)<.43;
     if(o.type==='police'){
       if(s.speed<=35){s.checkpoints++;s.score+=200;s.message='Kontrol tamam. İyi yolculuklar! +200';}
       else{s.health--;s.hit=.7;s.message='Çevirmede yavaşla! 35 km/sa altına in.';}
       s.messageTime=3;
     } else if(inLane&&o.type==='repair'){s.health=Math.min(3,s.health+1);s.score+=75;s.message='Sanayiye uğramadan tamir! +75';s.messageTime=2;}
     else if(inLane){s.health--;s.hit=.85;s.speed*=.5;s.holes+=o.type==='hole'?1:0;s.message=o.type==='hole'?'Bu çukur geçen sene de buradaydı.':'Çalışma var. Çalışan pek yok.';s.messageTime=2.5;}
     else if(o.type!=='repair'){s.dodged++;s.score+=50;}
   }
 }
 s.objects=s.objects.filter(o=>o.z>-.2);
 if(s.health<=0){s.health=0;s.status='over';s.brake=false;s.throttle=false;}
 else if(s.distance>=30){s.status='won';s.score+=s.health*300+500;s.brake=false;s.throttle=false;}
}

// Every world-space feature approaches the camera at the obstacle velocity.
export const roadDepth = (offset:number, travel:number) => ((offset-travel*120/340)%1+1)%1;
export function render(ctx:CanvasRenderingContext2D,w:number,h:number,s:GameState,bg:HTMLImageElement|null,time:number){
 ctx.clearRect(0,0,w,h);ctx.fillStyle='#9ed3d9';ctx.fillRect(0,0,w,h);
 if(bg?.complete&&bg.naturalWidth){const ih=h*1.2,iw=Math.max(w,ih*bg.naturalWidth/bg.naturalHeight);ctx.drawImage(bg,(w-iw)/2-Math.sin(s.distance*.3)*w*.012,-h*.5,iw,ih);}
 const hy=h*.34;const bend=Math.sin(s.distance*.3)*w*.075;
 const center=(t:number)=>w*.52+bend*Math.pow(1-t,2);
 const project=(z:number)=>{const t=Math.pow(Math.max(0,1-z),2);return {t,x:center(t),y:hy+t*h*.69,half:w*(.012+t*.49)};};
 const poly=(points:number[],color:string)=>{ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(points[0],points[1]);for(let i=2;i<points.length;i+=2)ctx.lineTo(points[i],points[i+1]);ctx.closePath();ctx.fill();};
 // The road mesh, lane markings and roadside markers share the collision world's perspective.
 for(let i=0;i<100;i++){
   const a=project(1-i/100),b=project(1-(i+1)/100);
   poly([0,a.y,w,a.y,w,b.y,0,b.y],'#baa574');
   poly([a.x-a.half*1.09,a.y,a.x+a.half*1.09,a.y,b.x+b.half*1.09,b.y,b.x-b.half*1.09,b.y],'#d8ceae');
   poly([a.x-a.half,a.y,a.x+a.half,a.y,b.x+b.half,b.y,b.x-b.half,b.y],i<20?'#687477':'#4a5458');
   for(const edge of [-1,1])poly([a.x+a.half*(edge-.012),a.y,a.x+a.half*(edge+.012),a.y,b.x+b.half*(edge+.012),b.y,b.x+b.half*(edge-.012),b.y],'#eee8ce');
 }
 // Continuous perspective dashes flow from the horizon down toward the car.
 for(let j=0;j<12;j++){
   const z=roadDepth(j/12,s.travel);const a=project(z),b=project(Math.max(0,z-.036));
   for(const lane of [-1/3,1/3])poly([a.x+a.half*(lane-.009),a.y,a.x+a.half*(lane+.009),a.y,b.x+b.half*(lane+.009),b.y,b.x+b.half*(lane-.009),b.y],'#f1edcf');
 }
 // Guardrails remain attached to the road; supports pass the camera with the dashes.
 for(const side of [-1,1]){
  for(let i=0;i<35;i++){const a=project(1-i/35),b=project(1-(i+1)/35);const ax=a.x+side*a.half*1.12,bx=b.x+side*b.half*1.12,ah=4+a.t*33,bh=4+b.t*33;
   poly([ax,a.y-ah,bx,b.y-bh,bx,b.y-bh+2+b.t*7,ax,a.y-ah+2+a.t*7],'#aebcba');
   poly([ax,a.y-ah,bx,b.y-bh,bx+side*(1+b.t*4),b.y-bh-2,ax+side*(1+a.t*4),a.y-ah-2],'#e1e5d4');
  }
 }
 for(let j=14;j>=0;j--){const z=roadDepth(j/15,s.travel);const p=project(z);for(const side of [-1,1]){const x=p.x+side*p.half*1.12,hh=4+33*p.t;ctx.fillStyle='#8c9b96';ctx.fillRect(x,p.y-hh,2+4*p.t,hh);ctx.fillStyle='#fff1b0';ctx.fillRect(x-1,p.y-hh+3,3+5*p.t,3+3*p.t);}}
 const car=(x:number,y:number,cw:number,color:string,police=false)=>{
   const ch=cw*1.03;ctx.save();ctx.translate(x,y);
   ctx.fillStyle='#10232655';ctx.beginPath();ctx.ellipse(cw*.08,cw*.05,cw*.7,cw*.19,0,0,Math.PI*2);ctx.fill();
   // Wide rear tyres, rear hatch glass, taillight bar and plate make the heading unmistakable.
   ctx.fillStyle='#182327';for(const side of [-1,1]){ctx.beginPath();ctx.roundRect(side*cw*.44-cw*.075,-ch*.5,cw*.15,ch*.52,cw*.045);ctx.fill();}
   const paint=ctx.createLinearGradient(-cw*.5,-ch,cw*.5,0);paint.addColorStop(0,police?'#fffdf2':'#ffe394');paint.addColorStop(.4,color);paint.addColorStop(1,police?'#b8c9c9':'#ca8831');
   ctx.fillStyle=paint;ctx.beginPath();ctx.moveTo(-cw*.47,-ch*.05);ctx.quadraticCurveTo(-cw*.55,-ch*.26,-cw*.43,-ch*.6);ctx.lineTo(-cw*.33,-ch*.96);ctx.quadraticCurveTo(0,-ch*1.08,cw*.33,-ch*.96);ctx.lineTo(cw*.43,-ch*.6);ctx.quadraticCurveTo(cw*.55,-ch*.26,cw*.47,-ch*.05);ctx.closePath();ctx.fill();
   poly([-cw*.29,-ch*.91,cw*.29,-ch*.91,cw*.37,-ch*.53,-cw*.37,-ch*.53],'#152f3b');
   const glass=ctx.createLinearGradient(0,-ch*.9,0,-ch*.51);glass.addColorStop(0,'#85b7bd');glass.addColorStop(.55,'#365568');glass.addColorStop(1,'#233e4c');
   ctx.fillStyle=glass;ctx.beginPath();ctx.moveTo(-cw*.265,-ch*.865);ctx.lineTo(cw*.265,-ch*.865);ctx.lineTo(cw*.325,-ch*.57);ctx.lineTo(-cw*.325,-ch*.57);ctx.closePath();ctx.fill();
   poly([-cw*.24,-ch*.85,-cw*.05,-ch*.85,-cw*.26,-ch*.59,-cw*.31,-ch*.59],'#c7e4df40');
   ctx.strokeStyle='#172a30';ctx.lineWidth=cw*.019;ctx.beginPath();ctx.moveTo(0,-ch*.585);ctx.lineTo(cw*.2,-ch*.69);ctx.stroke();
   ctx.fillStyle=police?'#d6e4e4':'#ffe196';ctx.fillRect(-cw*.32,-ch*.99,cw*.64,ch*.035);
   ctx.fillStyle='#6f341e';ctx.beginPath();ctx.roundRect(-cw*.44,-ch*.36,cw*.88,ch*.1,cw*.025);ctx.fill();
   ctx.shadowColor='#ff503a';ctx.shadowBlur=!police&&s.brake?14:2;ctx.fillStyle=!police&&s.brake?'#ff6550':'#e55342';ctx.fillRect(-cw*.415,-ch*.34,cw*.24,ch*.055);ctx.fillRect(cw*.175,-ch*.34,cw*.24,ch*.055);ctx.fillRect(-cw*.175,-ch*.32,cw*.35,ch*.015);ctx.shadowBlur=0;
   ctx.fillStyle='#f5edd4';ctx.beginPath();ctx.roundRect(-cw*.18,-ch*.22,cw*.36,ch*.1,2);ctx.fill();ctx.fillStyle='#253e41';ctx.font=`bold ${cw*.063}px Arial`;ctx.textAlign='center';ctx.fillText(police?'POLİS':'GRN 001',0,-ch*.15);
   ctx.fillStyle='#24343b';ctx.beginPath();ctx.roundRect(-cw*.44,-ch*.065,cw*.88,ch*.06,cw*.025);ctx.fill();
   for(const side of [-1,1]){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(side*cw*.48-cw*.035,-ch*.65,cw*.07,ch*.08,2);ctx.fill();}
   if(police){ctx.fillStyle=Math.sin(time*8)>0?'#47adff':'#ed6149';ctx.fillRect(-cw*.23,-ch*1.06,cw*.46,ch*.08);}
   ctx.restore();
 };
 // A readable roadside destination sign, rendered in the world.
 // Keep a readable board on narrow screens, with separate destination/distance rows.
 const sw=Math.min(190,Math.max(94,w*.18)),sh=sw*.59;
 const signX=Math.min(w-sw/2-9,Math.max(w*.82,w*.55+sw/2)),signY=Math.max(h*.34,sh+76);
 ctx.fillStyle='#788174';ctx.fillRect(signX-sw*.3,signY,sw*.025,sh*1.6);ctx.fillRect(signX+sw*.3,signY,sw*.025,sh*1.6);
 ctx.fillStyle='#205b4c';ctx.fillRect(signX-sw*.5,signY-sh,sw,sh);ctx.strokeStyle='#e4e9d1';ctx.lineWidth=2;ctx.strokeRect(signX-sw*.5+4,signY-sh+4,sw-8,sh-8);
 ctx.fillStyle='#fff8e3';ctx.textAlign='center';
 ctx.font=`bold ${sw*.135}px Arial`;ctx.fillText('LEFKOŞA ↑',signX,signY-sh*.64,sw-16);
 ctx.font=`${sw*.098}px Arial`;ctx.fillText('NICOSIA',signX,signY-sh*.4,sw-16);
 ctx.font=`bold ${sw*.11}px Arial`;ctx.fillText(`${Math.ceil(30-s.distance)} km`,signX,signY-sh*.15,sw-16);
 const bw=Math.min(198,Math.max(94,w*.2)),bh=bw*.39;
 const boardX=Math.min(w-bw/2-8,w*.865),boardY=Math.max(h*.55,signY+bh+22);
 ctx.fillStyle='#645f47';ctx.fillRect(boardX-bw*.34,boardY,bw*.025,bh*.8);ctx.fillRect(boardX+bw*.32,boardY,bw*.025,bh*.8);
 ctx.fillStyle='#e9bd54';ctx.fillRect(boardX-bw*.5,boardY-bh,bw,bh);ctx.strokeStyle='#665932';ctx.lineWidth=2;ctx.strokeRect(boardX-bw*.5+3,boardY-bh+3,bw-6,bh-6);
 ctx.fillStyle='#3d4230';ctx.textAlign='center';ctx.font=`bold ${bw*.088}px Arial`;ctx.fillText('GEÇİCİ ÇÖZÜM',boardX,boardY-bh*.58,bw-12);ctx.fillText('KALICI ÇUKUR',boardX,boardY-bh*.25,bw-12);
 const objects=s.status==='ready'?[{lane:0,z:.37,type:'hole'},{lane:2,z:.59,type:'barrier'},{lane:1,z:.8,type:'hole'}] as Obstacle[]:s.objects;
 for(const o of [...objects].sort((a,b)=>b.z-a.z)){
   if(o.z<-.08||o.z>1)continue;const p=project(o.z);const x=p.x+(o.lane-1)*p.half*2/3;const size=Math.max(3,p.half*.38);
   if(o.type==='hole'){
     ctx.fillStyle='#242d2b';ctx.beginPath();ctx.ellipse(x,p.y,size*.78,size*.27,-.08,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#8e8164';ctx.lineWidth=Math.max(2,size*.09);ctx.stroke();
     ctx.fillStyle='#161f21';ctx.beginPath();ctx.ellipse(x+size*.05,p.y+size*.04,size*.55,size*.15,-.08,0,Math.PI*2);ctx.fill();
     ctx.strokeStyle='#d1bb80';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-size,p.y+size*.1);ctx.lineTo(x-size*.8,p.y+size*.16);ctx.lineTo(x-size*1.1,p.y+size*.26);ctx.stroke();
   }else if(o.type==='barrier'){
     ctx.fillStyle='#363c39';ctx.fillRect(x-size*.7,p.y-size*.6,size*.12,size*.65);ctx.fillRect(x+size*.58,p.y-size*.6,size*.12,size*.65);
     ctx.fillStyle='#f7e9c5';ctx.fillRect(x-size*.9,p.y-size*.8,size*1.8,size*.46);
     for(let k=0;k<4;k++)poly([x-size*.9+k*size*.45,p.y-size*.34,x-size*.67+k*size*.45,p.y-size*.8,x-size*.46+k*size*.45,p.y-size*.8,x-size*.69+k*size*.45,p.y-size*.34],'#e0753d');
     ctx.fillStyle='#ffb63e';ctx.beginPath();ctx.arc(x,p.y-size*.91,size*.08,0,Math.PI*2);ctx.fill();
   }else if(o.type==='repair'){
     ctx.fillStyle='#72d4ae';ctx.beginPath();ctx.arc(x,p.y-size*.35,size*.4,0,Math.PI*2);ctx.fill();ctx.fillStyle='#173c34';ctx.textAlign='center';ctx.font=`bold ${size*.65}px Arial`;ctx.fillText('+',x,p.y-size*.12);
   }else{
     car(p.x+p.half*1.23,p.y,size*.95,'#edf0df',true);ctx.fillStyle='#e8b63d';ctx.fillRect(p.x-p.half,p.y-size*.06,p.half*2,size*.06);
     for(const side of [-1,1]){const xx=p.x+side*p.half*.91;poly([xx-size*.12,p.y,xx+size*.12,p.y,xx,p.y-size*.45],'#ed8439');}
   }
 }
 const p=project(.08);const cx=p.x+(s.visualLane-1)*p.half*2/3;const cw=Math.max(42,Math.min(112,w*.1));
 ctx.save();if(s.hit>0){ctx.translate(Math.sin(time*70)*s.hit*9,0);ctx.globalAlpha=.55+Math.abs(Math.sin(time*16))*.45;}
 ctx.translate(cx,p.y);ctx.rotate((s.lane-s.visualLane)*.065);car(0,Math.sin(time*12)*(s.status==='playing'?.5:0),cw,'#edbb43');
 ctx.restore();
 const gradient=ctx.createLinearGradient(0,h*.77,0,h);gradient.addColorStop(0,'#12292500');gradient.addColorStop(1,'#12292566');ctx.fillStyle=gradient;ctx.fillRect(0,h*.77,w,h*.23);
}
