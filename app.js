/* CHORD ATLAS — local-first music theory playground. No external libraries. */
(()=>{'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const NOTE_SHARPS=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const NOTE_LABELS=['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
const FIFTHS=[0,7,2,9,4,11,6,1,8,3,10,5];
const QUALITY={
 maj:{label:'Mayor',symbol:'',ints:[0,4,7],formula:'1 · 3 · 5'},m:{label:'Minor',symbol:'m',ints:[0,3,7],formula:'1 · ♭3 · 5'},
 '7':{label:'Dominant 7',symbol:'7',ints:[0,4,7,10],formula:'1 · 3 · 5 · ♭7'},maj7:{label:'Major 7',symbol:'maj7',ints:[0,4,7,11],formula:'1 · 3 · 5 · 7'},
 m7:{label:'Minor 7',symbol:'m7',ints:[0,3,7,10],formula:'1 · ♭3 · 5 · ♭7'},m7b5:{label:'Minor 7 ♭5',symbol:'m7♭5',ints:[0,3,6,10],formula:'1 · ♭3 · ♭5 · ♭7'},
 dim:{label:'Diminished',symbol:'dim',ints:[0,3,6],formula:'1 · ♭3 · ♭5'},dim7:{label:'Diminished 7',symbol:'dim7',ints:[0,3,6,9],formula:'1 · ♭3 · ♭5 · 6'},
 sus4:{label:'Sus 4',symbol:'sus4',ints:[0,5,7],formula:'1 · 4 · 5'},sus2:{label:'Sus 2',symbol:'sus2',ints:[0,2,7],formula:'1 · 2 · 5'},
 add9:{label:'Add 9',symbol:'add9',ints:[0,4,7,14],formula:'1 · 3 · 5 · 9'},'9':{label:'Dominant 9',symbol:'9',ints:[0,4,7,10,14],formula:'1 · 3 · 5 · ♭7 · 9'},
 maj9:{label:'Major 9',symbol:'maj9',ints:[0,4,7,11,14],formula:'1 · 3 · 5 · 7 · 9'},m9:{label:'Minor 9',symbol:'m9',ints:[0,3,7,10,14],formula:'1 · ♭3 · 5 · ♭7 · 9'},
 '7b9':{label:'7 ♭9',symbol:'7(♭9)',ints:[0,4,7,10,13],formula:'1 · 3 · 5 · ♭7 · ♭9'},'7b9b13':{label:'7 ♭9 ♭13',symbol:'7(♭9,♭13)',ints:[0,4,7,10,13,20],formula:'1 · 3 · 5 · ♭7 · ♭9 · ♭13'},
 '7#9':{label:'7 #9',symbol:'7(#9)',ints:[0,4,7,10,15],formula:'1 · 3 · 5 · ♭7 · ♯9'},'6':{label:'Major 6',symbol:'6',ints:[0,4,7,9],formula:'1 · 3 · 5 · 6'},
 m6:{label:'Minor 6',symbol:'m6',ints:[0,3,7,9],formula:'1 · ♭3 · 5 · 6'},'7b13':{label:'7 ♭13',symbol:'7(♭13)',ints:[0,4,7,10,20],formula:'1 · 3 · 5 · ♭7 · ♭13'}
};
const SCALES={
 major:{label:'Major (Ionian)',steps:[0,2,4,5,7,9,11],desc:'Terang, stabil, dan akrab di telinga.'},
 minor:{label:'Natural Minor (Aeolian)',steps:[0,2,3,5,7,8,10],desc:'Lebih sendu, hangat, dan reflektif.'},
 dorian:{label:'Dorian',steps:[0,2,3,5,7,9,10],desc:'Minor dengan nada ke-6 yang lebih cerah.'},
 phrygian:{label:'Phrygian',steps:[0,1,3,5,7,8,10],desc:'Minor dengan nada kedua turun, warna gelap.'},
 locrian:{label:'Locrian',steps:[0,1,3,5,6,8,10],desc:'Minor yang labil dengan nada kelima turun.'},
 mixolydian:{label:'Mixolydian',steps:[0,2,4,5,7,9,10],desc:'Groovy, sering dipakai blues dan funk.'},
 lydian:{label:'Lydian',steps:[0,2,4,6,7,9,11],desc:'Nuansa mengambang dengan nada ke-4 naik.'},
 harmonic_minor:{label:'Harmonic Minor',steps:[0,2,3,5,7,8,11],desc:'Minor dramatis dengan dominant mayor yang kuat.'},
 melodic_minor:{label:'Jazz Melodic Minor',steps:[0,2,3,5,7,9,11],desc:'Minor modern dengan warna jazz.'}
};
const ROM_MAJOR=['I','ii','iii','IV','V','vi','vii°'];
const ROM_MINOR=['i','ii°','III','iv','V','VI','VII'];
const HARMONY_MAJOR={1:[4,5,6,2],2:[5,4,7,1],3:[6,4,2,1],4:[5,1,2,6],5:[1,6,4,3],6:[2,4,5,1],7:[1,3,5,6]};
const HARMONY_MINOR={1:[4,6,5,2],2:[5,1,6,7],3:[6,4,7,5],4:[5,1,7,2],5:[1,6,4,3],6:[4,2,5,7],7:[1,3,6,5]};
const HARMONY_JAZZ={1:[6,2,4,3],2:[5,7,4,1],3:[6,2,5,4],4:[7,2,5,1],5:[1,6,3,2],6:[2,4,5,1],7:[3,1,5,2]};
const ROUTE_HINTS={1:'Pulang ke rumah. Stabil dan pas buat mengakhiri bagian lagu.',2:'Mulai membangun ketegangan; biasanya enak menuju V.',3:'Warna yang lebih lembut. Sering mengantar ke vi atau IV.',4:'Ruang baru yang terasa lega; bisa lanjut ke V atau I.',5:'Puncak ketegangan. Umumnya ingin balik ke I.',6:'Membawa rasa emosional dan membuka banyak arah.',7:'Nada penghubung yang mendorong kembali ke pusat nada.'};
const PAGES={cheats:['CHEAT SHEET','KEYS · MODES · CHORDS','Cheat <em>Sheet.</em>','Scale, mode, interval, dan chord dalam satu halaman.'],transcribe:['TRANSKRIPSI LAGU','AUDIO TO PIANO ROLL','Hear it. <em>See it.</em>','Kulik nada dari rekaman dan edit di piano roll.'],studio:['PIANO STUDIO','INTERACTIVE MUSIC WORKSPACE','Play it. <em>Feel it.</em>','Pilih chord, lihat posisi jari, dan dengarkan langsung dari piano.'],circle:['CIRCLE OF FIFTHS','THE HARMONY UNIVERSE','Find your <em>orbit.</em>','Putar lingkaran harmoni. Temukan keluarga chord dan nada yang saling dekat.'],paths:['CHORD JOURNEY','YOUR NEXT CHORD IS OUT THERE','Follow the <em>sound.</em>','Mulai dari satu chord. Pilih cabang berikutnya, lalu dengarkan hasilnya.'],learn:['BELAJAR NOTASI','READ • PLAY • REMEMBER','See the <em>music.</em>','Dari garis paranada sampai membaca chord. Mulai pelan-pelan, langsung praktik.']};
let state={page:'studio',key:0,scale:'major',transpose:0,sound:true,root:0,quality:'maj7',bass:-1,circleMode:'major',style:'major',start:1,progression:[],lesson:'notes',lessonNote:60,quiz:{midi:64,correct:0,total:0,streak:0,answered:false}};
let audio=null,master=null,activeKeys=new Set(),playSerial=0,toastTimer=null,graphSuggestions=[];
let hadSavedJourney=false, chordGuideEnabled=false;
function saveLocal(){try{localStorage.setItem('chord-atlas-state-v1',JSON.stringify({key:state.key,scale:state.scale,transpose:state.transpose,root:state.root,quality:state.quality,bass:state.bass,circleMode:state.circleMode,style:state.style,start:state.start,progression:state.progression}));}catch(_){/* private browsing may restrict storage */}}
function restoreLocal(){try{const raw=localStorage.getItem('chord-atlas-state-v1');if(!raw)return;const s=JSON.parse(raw);if(!s||typeof s!=='object')return;for(const k of ['key','root','transpose','bass','start'])if(Number.isInteger(s[k]))state[k]=s[k];for(const k of ['scale','quality','circleMode','style'])if(typeof s[k]==='string')state[k]=s[k];if(!SCALES[state.scale])state.scale='major';if(!QUALITY[state.quality])state.quality='maj7';if(!['major','minor'].includes(state.circleMode))state.circleMode='major';if(!['major','minor','jazz'].includes(state.style))state.style='major';state.key=mod(state.key);state.root=mod(state.root);state.transpose=Math.max(-11,Math.min(11,state.transpose));state.bass=state.bass<0?-1:mod(state.bass);if(Array.isArray(s.progression)){state.progression=s.progression.filter(c=>c&&Number.isInteger(c.root)&&QUALITY[c.quality]).slice(0,64).map(c=>chordObj(c.root,c.quality,Number.isInteger(c.bass)?c.bass:-1,Number.isInteger(c.degree)?c.degree:null));hadSavedJourney=true;}}catch(_){}}
function mod(n,m=12){return ((n%m)+m)%m}
function noteName(pc){return NOTE_LABELS[mod(pc)]}
function shortName(midi){return noteName(midi)+String(Math.floor(midi/12)-1)}
function chordObj(root,quality='maj',bass=-1,degree=null){return {root:mod(root),quality,bass,degree}}
function chordText(c){if(!c)return '—';return noteName(c.root)+(QUALITY[c.quality]?.symbol||'')+(c.bass>=0?'/'+noteName(c.bass):'')}
function chordTones(c){return (QUALITY[c.quality]||QUALITY.maj).ints.map(i=>mod(c.root+i))}
function midiNotes(c){let bass=c.bass>=0?c.bass:c.root;let low=36+bass; // C2–B2
 let base=(c.root>=7?48:60)+c.root; // keys around C4, A3–B3
 let right=(QUALITY[c.quality]||QUALITY.maj).ints.map(i=>base+i);
 right=right.map(n=>n>84?n-12:n);
 return {left:[low,low+7],right,rightAll:right};}
function transposeChord(c,semi){return chordObj(c.root+semi,c.quality,c.bass<0?-1:c.bass+semi,c.degree)}
function setGlobalSelect(id,options,val){const el=$(id);el.innerHTML=options.map(o=>`<option value="${o.value}">${o.label}</option>`).join('');el.value=String(val)}
function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),3000)}
function updateRootOptions(){let opt=NOTE_LABELS.map((n,i)=>({value:i,label:n}));setGlobalSelect('#global-key',opt,state.key);setGlobalSelect('#root-note',opt,state.root);setGlobalSelect('#bass-note',[{value:-1,label:'Tanpa slash'},...opt],state.bass)}
function initControls(){updateRootOptions();setGlobalSelect('#global-scale',Object.entries(SCALES).map(([value,a])=>({value,label:a.label})),state.scale);setGlobalSelect('#chord-quality',Object.entries(QUALITY).map(([value,q])=>({value,label:q.label})),state.quality);$('#year').textContent=new Date().getFullYear();$('#bpm-value').textContent=$('#bpm').value+' BPM';}
function currentChord(){return chordObj(state.root,state.quality,state.bass)}
function audioContext(){if(!state.sound)return null;if(!audio){const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx){toast('Browser ini belum mendukung audio Web Audio.');return null;}audio=new Ctx();master=audio.createDynamicsCompressor();master.threshold.value=-16;master.knee.value=24;master.ratio.value=3;master.attack.value=.006;master.release.value=.3;const gain=audio.createGain();gain.gain.value=.7;master.connect(gain);gain.connect(audio.destination);}if(audio.state==='suspended'){audio.resume().catch(err=>{console.warn('Audio belum dapat dibuka:',err);sampleIndicator('Klik Tes suara untuk mengaktifkan audio');});}return audio}
// TimGM6mb sampled grand piano bank: 17 notes, one every minor third.
// Unlike oscillators these are recordings of a sampled acoustic piano.
let pianoSamples=new Map(),pianoBankLoading=null,pianoBankReady=false,pianoQueue=[];
function sampleIndicator(t){const el=$('#sample-status');if(el)el.textContent=t}
async function loadPianoBank(){
 if(pianoBankLoading)return pianoBankLoading;
 const ctx=audioContext();if(!ctx)return;
 sampleIndicator('Menyiapkan piano akustik...');
 pianoBankLoading=(async()=>{
  const bank=window.CHORD_ATLAS_PIANO_BANK||{};
  const keys=Object.keys(bank);
  if(!keys.length){sampleIndicator('Sampel belum terpasang · audio-bank.js tidak ditemukan');pianoQueue.length=0;toast('File audio-bank.js tidak ditemukan. Ekstrak ZIP lengkap.');return;}
  let loaded=0;
  const results=await Promise.allSettled(keys.map(async key=>{
    // decode from inline sample bytes; no fetch(), CORS, or server required.
    const bin=atob(bank[key]);const bytes=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
    const buffer=await ctx.decodeAudioData(bytes.buffer);
    pianoSamples.set(Number(key),buffer);loaded++;
    if(loaded===keys.length||loaded%4===0)sampleIndicator('Menyiapkan piano '+loaded+'/'+keys.length);
  }));
  pianoBankReady=pianoSamples.size>0;
  if(pianoBankReady){sampleIndicator('Grand Piano · siap dimainkan ('+pianoSamples.size+' sampel)');
   const todo=pianoQueue.splice(0),now=ctx.currentTime;
   for(const item of todo)sampledTone(item.midi,now+.055+Math.max(0,item.delay),item.duration,item.volume);
  }else{sampleIndicator('Sampel piano tidak dapat dibaca');pianoQueue.length=0;toast('Audio gagal: coba Chrome atau Edge versi terbaru.');}
  const missing=results.filter(v=>v.status==='rejected').length;
  if(missing)console.warn('Sampel audio yang tidak berhasil didekode:',missing,results.find(v=>v.status==='rejected')?.reason);
 })();return pianoBankLoading;
}
function sampledTone(midi,when,duration=.9,volume=.3){
 const ctx=audioContext();if(!ctx||pianoSamples.size===0)return;
 const bases=[...pianoSamples.keys()],base=bases.reduce((best,m)=>Math.abs(m-midi)<Math.abs(best-midi)?m:best,bases[0]);
 const sample=pianoSamples.get(base);if(!sample)return;
 const src=ctx.createBufferSource();src.buffer=sample;src.playbackRate.value=Math.pow(2,(midi-base)/12);
 const g=ctx.createGain(),t=Math.max(ctx.currentTime+.002,when||ctx.currentTime+.008);
 const velocity=Math.max(.045,Math.min(.6,volume))*.82;
 g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(velocity,t+.009);
 g.gain.setValueAtTime(velocity,t+Math.min(.23,Math.max(.1,duration*.26)));
 const end=t+Math.min(duration,Math.max(.25,sample.duration/src.playbackRate.value-.04));
 g.gain.setValueAtTime(velocity,end);g.gain.exponentialRampToValueAtTime(.0001,end+.22);
 src.connect(g);g.connect(master);src.start(t);src.stop(Math.min(t+sample.duration/src.playbackRate.value,end+.24));
}
function tone(midi,when=null,duration=.8,volume=.30){
 const ctx=audioContext();if(!ctx)return;
 if(!pianoBankReady){pianoQueue.push({midi,delay:Math.max(0,(when??ctx.currentTime)-ctx.currentTime),duration,volume});loadPianoBank();return;}
 sampledTone(midi,Math.max(ctx.currentTime+.006,when??ctx.currentTime+.008),duration,volume);
}

function playNote(midi){tone(midi+state.transpose,null,.7,.30);flashKey(midi)}
function playChord(c=currentChord(),delaySec=0,duration=1.15){if(!state.sound){toast('Aktifkan suara di bagian OUTPUT AUDIO.');return}const ctx=audioContext();if(!ctx)return;const m=midiNotes(c),time=ctx.currentTime+delaySec+.025;
 m.left.forEach((n,i)=>tone(n+state.transpose,time+i*.022,duration,.19));m.right.forEach((n,i)=>tone(n+state.transpose,time+i*.012,duration,.16));
 if(delaySec===0){setTimeout(()=>flashChord(c),30)} }
function flashKey(midi){const target=$(`#piano [data-midi="${midi}"]`);if(!target)return;target.classList.add('is-pressed');setTimeout(()=>target.classList.remove('is-pressed'),270)}
function flashChord(c){const n=midiNotes(c);[...n.left,...n.right].forEach(flashKey)}
function switchPage(page){if(!PAGES[page])return;state.page=page;$$('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.page===page));$$('.page').forEach(p=>p.classList.toggle('active',p.id==='page-'+page));const meta=PAGES[page];$('#breadcrumb-name').textContent=meta[0];if($('#page-eyebrow'))$('#page-eyebrow').innerHTML=meta[1];if($('#page-title'))$('#page-title').innerHTML=meta[2];if($('#page-desc'))$('#page-desc').textContent=meta[3];$('#sidebar').classList.remove('is-open');if(page==='circle')renderCircle();if(page==='paths')renderJourney();if(page==='learn')renderLearning();if(page==='cheats')renderCheatSheet();if(page==='transcribe')renderRoll();else if(rollState.playing)stopRoll();window.scrollTo({top:0,behavior:'smooth'});}
function scaleSteps(){return SCALES[state.scale].steps}
function degreeQuality(scale,index,style='major'){const ints=[0,2,4,6].map(d=>mod(scale[(index+d)%7]-scale[index]+(index+d>=7?12:0)));const third=mod(ints[1]),fifth=mod(ints[2]),seventh=mod(ints[3]);if(style==='jazz'){if(third===4&&fifth===7&&seventh===11)return 'maj7';if(third===3&&fifth===7&&seventh===10)return 'm7';if(third===3&&fifth===6&&seventh===10)return 'm7b5';if(third===4&&seventh===10)return '7';}if(third===4&&fifth===7)return 'maj';if(third===3&&fifth===7)return 'm';if(third===3&&fifth===6)return 'dim';if(third===4&&fifth===8)return 'maj';return 'm'}
function diatonicChord(degree,style=state.style){const minor=style==='minor';const s=(minor?SCALES.harmonic_minor:SCALES.major).steps;const i=degree-1;let q=degreeQuality(s,i,style==='jazz'?'jazz':style);
 // Jazz: conventional major-key seventh chords, with dominant seventh on V.
 if(style==='jazz')q=['maj9','m9','m7','maj7','9','m7','m7b5'][i];
 if(style==='minor'){q=['m','dim','maj','m','7','maj','dim'][i];}
 return chordObj(state.key+s[i],q,-1,degree)}
function diatonicChordsForScale(){let scale=scaleSteps();return scale.map((s,i)=>chordObj(state.key+s,degreeQuality(scale,i,'jazz'),-1,i+1))}
function renderStudio(){saveLocal();const c=currentChord(),notes=midiNotes(c);$('#selected-chord').textContent=chordText(c);$('#chord-formula').textContent='Rumus '+(QUALITY[c.quality]?.formula||'1 · 3 · 5');$('#left-hand').textContent=notes.left.map(shortName).join(' · ');$('#right-hand').textContent=notes.right.map(shortName).join(' · ');$('#heard-as').textContent='Suara yang keluar: '+chordText(transposeChord(c,state.transpose));$('#transpose-value').textContent=(state.transpose>0?'+':'')+state.transpose;$('#keyboard-caption').textContent=state.transpose!==0?'Tekan '+chordText(c)+' → suara '+chordText(transposeChord(c,state.transpose)):'Klik tuts untuk bunyi';const scale=scaleSteps();$('#scale-notes').textContent=scale.map(i=>noteName(state.key+i)).join('  ·  ');$('#scale-degrees').innerHTML=scale.map((_,i)=>`<span>${['1','2','3','4','5','6','7'][i]}</span>`).join('');const degreeLabels=['TONIC','SUPERTONIC','MEDIANT','SUBDOMINANT','DOMINANT','SUBMEDIANT','LEADING'];$('#diatonic-list').innerHTML=diatonicChordsForScale().map((d,i)=>`<button class="diatonic-row" data-degree="${i}"><span class="degree-chip">${state.scale==='minor'?ROM_MINOR[i]:ROM_MAJOR[i]}</span><strong>${chordText(d)}</strong><span class="function-label">${degreeLabels[i]}</span><span class="inline-play">▶</span></button>`).join('');paintPiano();}
const PIANO_MIN=21,PIANO_MAX=108,PIANO_WHITE_W=32;
const pianoWhites=Array.from({length:PIANO_MAX-PIANO_MIN+1},(_,i)=>PIANO_MIN+i).filter(m=>![1,3,6,8,10].includes(m%12));
function jumpToPiano(place,kind){
 const roll=kind==='fall',shell=roll?$('#fall-scroller'):$('#piano');if(!shell)return;
 const whiteW=roll?FALL_W:PIANO_WHITE_W,whiteNotes=roll?fallWhites:pianoWhites;
 const midi=place==='low'?21:place==='high'?108:60;
 const idx=whiteNotes.indexOf(midi),center=idx*whiteW+whiteW/2;
 const target=place==='low'?0:place==='high'?shell.scrollWidth-shell.clientWidth:center-shell.clientWidth/2;
 shell.scrollLeft=Math.max(0,Math.min(shell.scrollWidth-shell.clientWidth,target));
 const attr=roll?'data-fall-jump':'data-piano-jump';
 $$('['+attr+']').forEach(b=>{const active=b.getAttribute(attr)===place;b.classList.toggle('is-selected',active);b.setAttribute('aria-pressed',String(active))});
}
function createKeyboard(){
 const shell=$('#piano');const inner=document.createElement('div');inner.className='piano-inner';
 const width=pianoWhites.length*PIANO_WHITE_W;
 inner.style.cssText='display:flex;position:relative;flex:0 0 '+width+'px;width:'+width+'px;min-width:'+width+'px;height:100%';
 for(const m of pianoWhites){const b=document.createElement('button');b.className='white-key';b.type='button';b.dataset.midi=m;b.setAttribute('aria-label',shortName(m));b.textContent=shortName(m);inner.appendChild(b)}
 for(let m=PIANO_MIN;m<=PIANO_MAX;m++){
  if(![1,3,6,8,10].includes(m%12))continue;
  const before=pianoWhites.filter(x=>x<m).length,b=document.createElement('button');
  b.type='button';b.className='black-key';b.dataset.midi=m;b.setAttribute('aria-label',shortName(m));b.textContent=shortName(m);
  b.style.left=(before*PIANO_WHITE_W-11)+'px';b.style.width='22px';inner.appendChild(b);
 }
 shell.appendChild(inner);
 shell.addEventListener('pointerdown',e=>{const button=e.target.closest('[data-midi]');if(!button)return;e.preventDefault();playNote(Number(button.dataset.midi));});
 requestAnimationFrame(()=>jumpToPiano('mid','main'));
}
function paintPiano(){const c=currentChord(),notes=midiNotes(c),l=new Set(notes.left),r=new Set(notes.right),scale=new Set(scaleSteps().map(i=>mod(i+state.key)));$$('#piano [data-midi]').forEach(el=>{const m=Number(el.dataset.midi);el.classList.toggle('is-left',chordGuideEnabled&&l.has(m));el.classList.toggle('is-right',chordGuideEnabled&&r.has(m));el.classList.toggle('in-scale',chordGuideEnabled&&scale.has(mod(m)));});}
// SVG geometry
function polar(x,y,r,a){const t=(a-90)*Math.PI/180;return [x+r*Math.cos(t),y+r*Math.sin(t)]}
function annular(cx,cy,r1,r2,a1,a2){const p1=polar(cx,cy,r2,a1),p2=polar(cx,cy,r2,a2),p3=polar(cx,cy,r1,a2),p4=polar(cx,cy,r1,a1);return `M ${p1.join(' ')} A ${r2} ${r2} 0 0 1 ${p2.join(' ')} L ${p3.join(' ')} A ${r1} ${r1} 0 0 0 ${p4.join(' ')} Z`}
function renderCircle(){let minor=state.circleMode==='minor';$$('[data-circle-mode]').forEach(b=>b.classList.toggle('active',b.dataset.circleMode===state.circleMode));let baseMajor=minor?mod(state.key+3):state.key;const majorName=noteName(baseMajor),minorName=noteName(baseMajor+9);$('#circle-key-big').innerHTML=(minor?minorName:majorName)+' <span>'+(minor?'minor':'major')+'</span>';$('#relative-key').textContent=minor?majorName+' major':minorName+' minor';$('#circle-description').textContent=minor?'Keluarga nada minor dan progresi yang lebih emosional.':'Nada di satu keluarga bisa berpindah dengan natural.';
 const chords=(minor?Array.from({length:7},(_,i)=>diatonicChord(i+1,'minor')):Array.from({length:7},(_,i)=>diatonicChord(i+1,'major')));
 $('#circle-family').innerHTML=chords.map((c,i)=>`<button class="family-chord" data-family="${i}"><span>${minor?ROM_MINOR[i]:ROM_MAJOR[i]}</span>${chordText(c)}</button>`).join('');
 let svg=`<defs><radialGradient id="globeCore"><stop stop-color="#1c3c63"/><stop offset=".55" stop-color="#172b49"/><stop offset="1" stop-color="#0e1a33"/></radialGradient><linearGradient id="ringColor" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6cdbd1"/><stop offset="1" stop-color="#836fea"/></linearGradient><filter id="halo"><feGaussianBlur stdDeviation="5"/></filter></defs>`;
 svg+=`<circle cx="320" cy="320" r="283" fill="#101d32" stroke="#334763" stroke-width="1"/><circle cx="320" cy="320" r="270" fill="none" stroke="#67dfd4" stroke-opacity=".27" stroke-width="2"/><circle cx="320" cy="320" r="235" fill="none" stroke="#7290b8" stroke-opacity=".15" stroke-dasharray="3 9"/>`;
 // decorative globe longitude and latitude arcs (non-interactive)
 svg+=`<g opacity=".20" pointer-events="none"><circle cx="320" cy="320" r="149" fill="url(#globeCore)" stroke="#7a83d4" stroke-width="1"/><ellipse cx="320" cy="320" rx="54" ry="147" fill="none" stroke="#61a1c8"/><ellipse cx="320" cy="320" rx="105" ry="147" fill="none" stroke="#61a1c8"/><ellipse cx="320" cy="320" rx="147" ry="59" fill="none" stroke="#61a1c8"/><ellipse cx="320" cy="320" rx="147" ry="112" fill="none" stroke="#61a1c8"/></g>`;
 FIFTHS.forEach((pc,i)=>{const a1=-15+i*30,a2=a1+30;let sel=pc===baseMajor;svg+=`<path class="wheel-slice" data-wheel="${i}" data-inner="0" d="${annular(320,320,222,268,a1+.7,a2-.7)}" fill="${sel?'#254d5b':'#192b43'}" stroke="${sel?'#74eddf':'#314960'}" stroke-width="${sel?2:1}"/>`;
 const pt=polar(320,320,245,i*30);svg+=`<text class="wheel-label ${sel?'active':''}" x="${pt[0]}" y="${pt[1]+5}" text-anchor="middle" font-size="${sel?18:15}">${noteName(pc)}</text>`;
 const rel=mod(pc+9),selMin=minor&&rel===state.key,p=polar(320,320,185,i*30);svg+=`<path class="wheel-slice" data-wheel="${i}" data-inner="1" d="${annular(320,320,165,209,a1+.7,a2-.7)}" fill="${selMin?'#493969':'#22243d'}" stroke="${selMin?'#bc99fa':'#4b4a70'}" stroke-width="${selMin?2:1}"/><text class="wheel-label minor-label ${selMin?'active':''}" x="${p[0]}" y="${p[1]+4}" text-anchor="middle">${noteName(rel)}m</text>`;
 });
 svg+=`<g pointer-events="none"><circle cx="320" cy="320" r="137" fill="#102036a1" stroke="#6a9ebd" stroke-opacity=".24"/><circle cx="320" cy="320" r="118" fill="none" stroke="#6293b2" stroke-opacity=".18" stroke-dasharray="2 8"/><text x="320" y="282" text-anchor="middle" class="orbit-center-small">CURRENT KEY</text><text x="320" y="349" text-anchor="middle" class="orbit-center-big">${minor?minorName:majorName}</text><text x="320" y="377" text-anchor="middle" class="orbit-center-small">${minor?'MINOR':'MAJOR'} • ${SCALES[state.scale].label.toUpperCase()}</text><path d="M302 404 L320 418 L338 404" fill="none" stroke="#62d7d2" stroke-width="2" opacity=".6"/></g>`;
 svg+=`<circle cx="320" cy="320" r="289" fill="none" stroke="#5879a7" stroke-opacity=".14" stroke-dasharray="4 11"/>`;$('#fifths-svg').innerHTML=svg;}
function changeKey(key,scale=null){const oldKey=state.key;state.key=mod(key);if(scale)state.scale=scale;const shift=mod(state.key-oldKey);if(shift)state.progression=state.progression.map(c=>c.degree?journeyRootChord(c.degree):transposeChord(c,shift));$('#global-key').value=state.key;$('#global-scale').value=state.scale;renderStudio();renderCircle();renderJourney();renderLearning();renderCheatSheet();}
function journeyRootChord(degree,style=state.style){return diatonicChord(degree,style)}
function setProgression(degrees){state.progression=degrees.map(d=>journeyRootChord(d));renderJourney()}
function setPreset(preset){const patterns={1452:[1,4,5,2],1564:[1,5,6,4],251:[2,5,1],1645:[1,6,4,5]};setProgression(patterns[preset]||[1,4,5,2]);$$('.preset').forEach(b=>b.classList.toggle('active',b.dataset.preset===preset));}
function progressionStyleInfo(degree){const roman=(state.style==='minor'?ROM_MINOR:ROM_MAJOR)[degree-1];return roman}
function getSuggestions(){const last=state.progression.at(-1);const deg=last?.degree||state.start;const table=state.style==='minor'?HARMONY_MINOR:state.style==='jazz'?HARMONY_JAZZ:HARMONY_MAJOR;let arr=table[deg].map((d,i)=>({chord:journeyRootChord(d),degree:d,why:ROUTE_HINTS[d],label:i===0?'Paling natural':i===1?'Alternatif enak':i===2?'Coba warna lain':'Jalur baru'}));
 if(state.style==='jazz') {const tonic=state.key;const special=deg===2?chordObj(tonic+7,'7b9',-1,null):deg===5?chordObj(tonic+1,'7',-1,null):deg===1?chordObj(tonic+9,'7',-1,null):chordObj(tonic+2,'7',-1,null);arr.push({chord:special,degree:null,why:deg===5?'Substitusi tritone: dominant alternatif yang mengarah ke I.':'Secondary dominant: memberi dorongan kuat ke chord tujuan.',label:'Jazz detour'});}
 return arr;}
function renderRouteSvg(){const last=state.progression.at(-1)||journeyRootChord(state.start),suggestions=graphSuggestions;let svg=`<defs><linearGradient id="linkGradient"><stop stop-color="#55d7d1"/><stop offset="1" stop-color="#9676df"/></linearGradient><filter id="blurGlow"><feGaussianBlur stdDeviation="5"/></filter></defs><g opacity=".13">${[50,100,150,200,250,300,350,400,450,500,550].map(x=>`<line x1="${x}" y1="0" x2="${x}" y2="350" stroke="#9ab6d4" stroke-dasharray="2 14"/>`).join('')}${[50,100,150,200,250,300].map(y=>`<line x1="0" y1="${y}" x2="600" y2="${y}" stroke="#9ab6d4" stroke-dasharray="2 14"/>`).join('')}</g>`;
 const target=suggestions.map((s,i)=>({x:338,y:43+(i*(265/Math.max(1,suggestions.length-1))),s,i}));const root={x:112,y:175};target.forEach(t=>{let p=`M ${root.x+44} ${root.y} C 240 ${root.y},242 ${t.y},${t.x-48} ${t.y}`;svg+=`<path d="${p}" fill="none" stroke="#73dcd7" stroke-opacity=".13" stroke-width="9" filter="url(#blurGlow)"/><path class="path-graph-line" d="${p}" stroke="url(#linkGradient)"/><path d="M ${t.x+45} ${t.y} C ${t.x+80} ${t.y},${t.x+90} ${t.y+12},${t.x+118} ${t.y+12}" fill="none" stroke="#53698a" stroke-width="1.2" stroke-dasharray="3 7"/><circle cx="${t.x+118}" cy="${t.y+12}" r="4" fill="#637694"/>`});
 svg+=`<circle cx="${root.x}" cy="${root.y}" r="55" fill="#21565c" opacity=".17" filter="url(#blurGlow)"/><circle cx="${root.x}" cy="${root.y}" r="47" fill="#1e4653" stroke="#61e4d5" stroke-width="2"/><text x="${root.x}" y="${root.y-5}" text-anchor="middle" class="path-graph-label">${chordText(last)}</text><text x="${root.x}" y="${root.y+15}" text-anchor="middle" class="path-graph-small">${last.degree?progressionStyleInfo(last.degree):'ALT'}</text>`;
 target.forEach(t=>{svg+=`<g class="route-option-node" data-route="${t.i}" tabindex="0" role="button" aria-label="Pilih chord ${chordText(t.s.chord)}"><circle class="node-circle" cx="${t.x}" cy="${t.y}" r="34" fill="#252c4b" stroke="#716da9" stroke-width="1.5"/><text x="${t.x}" y="${t.y+4}" text-anchor="middle" class="path-graph-label" style="font-size:${chordText(t.s.chord).length>7?12:15}px">${chordText(t.s.chord)}</text></g>`});
 $('#route-svg').innerHTML=svg;}
function renderJourney(){saveLocal();const chords=state.progression;$('#progression-count').textContent=chords.length+' CHORD';$('#progression-track').innerHTML=chords.length?chords.map((c,i)=>`${i?'<span class="progression-arrow">→</span>':''}<button class="progression-chip" data-existing="${i}">${chordText(c)}<span>${c.degree?progressionStyleInfo(c.degree):'jazz'}</span></button>`).join(''):'<span class="empty-track">Pilih titik awal atau jalur cepat untuk mulai.</span>';
 graphSuggestions=getSuggestions();$('#route-options').innerHTML=graphSuggestions.map((s,i)=>`<button class="route-option" data-add-route="${i}"><span class="route-roman">${s.degree?progressionStyleInfo(s.degree):'♯'}</span><span><strong>${chordText(s.chord)}</strong><small>${s.label}</small></span></button>`).join('');renderRouteSvg();let last=chords.at(-1),d=last?.degree;$('#journey-insight').textContent=last?`${chordText(last)} — mau ke mana lagi?`:'Mulai dari chord apa?';$('#journey-explain').textContent=d?ROUTE_HINTS[d]+' Pilih salah satu cabang untuk lanjut.':'Pilih jalur cepat, atau tentukan titik awal dari daftar.';$('#journey-style').value=state.style;$('#journey-start').value=state.start;}
function addSuggestion(index){const s=graphSuggestions[index];if(!s)return;state.progression.push({...s.chord});$$('.preset').forEach(b=>b.classList.remove('active'));renderJourney();playChord(s.chord)}
function playProgression(){if(!state.progression.length){toast('Belum ada chord dalam jalur.');return}const bpm=Number($('#bpm').value),step=60/bpm*4,sequence=++playSerial;state.progression.forEach((c,i)=>playChord(c,i*step,Math.min(2.1,step*.81)));toast(`Memutar ${state.progression.length} chord · ${bpm} BPM`);}
function downloadFile(name,bytes,type){const blob=new Blob([bytes],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000)}
function midiVar(n){let bytes=[n&127];while(n>>=7)bytes.unshift((n&127)|128);return bytes}
function writeMidi(){const ppq=480,bpm=Number($('#bpm').value),seq=state.progression;if(!seq.length){toast('Buat jalur chord dulu sebelum ekspor.');return}let events=[];function push(t,bytes,priority=1){events.push({t,bytes,priority})}push(0,[0xFF,0x51,3,...[(60000000/bpm>>16)&255,(60000000/bpm>>8)&255,(60000000/bpm)&255]]);push(0,[0xC0,0]);seq.forEach((c,i)=>{let all=midiNotes(transposeChord(c,state.transpose)),beat=i*ppq*4;[...new Set([...all.left,...all.right])].forEach(n=>{let v=Math.max(40,Math.min(100,72+(n<55?-8:0)));push(beat,[0x90,n,v],1);push(beat+ppq*3.3,[0x80,n,0],0)})});events.sort((a,b)=>a.t-b.t||a.priority-b.priority);let tr=[],prev=0;for(const e of events){tr.push(...midiVar(Math.round(e.t-prev)),...e.bytes);prev=e.t}tr.push(0,0xFF,0x2F,0);function u32(x){return [(x>>>24)&255,(x>>>16)&255,(x>>>8)&255,x&255]}let data=new Uint8Array([...Array.from('MThd').map(x=>x.charCodeAt(0)),...u32(6),0,0,0,1,(ppq>>8)&255,ppq&255,...Array.from('MTrk').map(x=>x.charCodeAt(0)),...u32(tr.length),...tr]);downloadFile('Chord_Atlas_Progression.mid',data,'audio/midi');toast('File MIDI berhasil dibuat.');}
// Music reading & notation. Noteheads and staves generated as SVG (no image assets).
const NATURAL_LETTERS=['C','D','E','F','G','A','B'];
function pitchInfo(midi){const pc=mod(midi),name=NOTE_LABELS[pc],letter=name[0],octave=Math.floor(midi/12)-1,acc=name.includes('#')?'♯':name.includes('b')?'♭':'';return {letter,octave,acc,name:name+octave}}
function naturalStep(letter,oct){return oct*7+NATURAL_LETTERS.indexOf(letter)}
function staffY(midi,clef='treble'){const p=pitchInfo(midi),baseline=clef==='treble'?160:288,ref=clef==='treble'?naturalStep('E',4):naturalStep('G',2);return baseline-(naturalStep(p.letter,p.octave)-ref)*10}
function drawStaffLines(startX=100,endX=680){let s='';for(let y=80;y<=160;y+=20)s+=`<line x1="${startX}" x2="${endX}" y1="${y}" y2="${y}" stroke="#647b93" stroke-width="1.4"/>`;for(let y=208;y<=288;y+=20)s+=`<line x1="${startX}" x2="${endX}" y1="${y}" y2="${y}" stroke="#647b93" stroke-width="1.4"/>`;return s}
function noteSvg(midi,x,clef='treble',active=false,scale=1){const y=staffY(midi,clef),base=clef==='treble'?160:288,top=clef==='treble'?80:208;let ledgers='';if(y>base+4){for(let ly=base+20;ly<=y+2;ly+=20)ledgers+=`<line x1="${x-19*scale}" x2="${x+19*scale}" y1="${ly}" y2="${ly}" stroke="#475e78" stroke-width="1.5"/>`;}if(y<top-4){for(let ly=top-20;ly>=y-2;ly-=20)ledgers+=`<line x1="${x-19*scale}" x2="${x+19*scale}" y1="${ly}" y2="${ly}" stroke="#475e78" stroke-width="1.5"/>`;}const p=pitchInfo(midi);let accidental=p.acc?`<text x="${x-25}" y="${y+6}" font-size="24" font-family="Georgia" fill="#52728c">${p.acc}</text>`:'';return `${ledgers}${accidental}<ellipse class="${active?'staff-active':'staff-note'}" cx="${x}" cy="${y}" rx="${12*scale}" ry="${8*scale}" transform="rotate(-18 ${x} ${y})"/><line x1="${x+10*scale}" x2="${x+10*scale}" y1="${y-3}" y2="${y-60}" stroke="${active?'#179d9f':'#263650'}" stroke-width="2"/>`}
function quizSvg(midi){const y=staffY(midi,'treble');return `<svg viewBox="0 0 240 130" style="max-width:240px;width:100%;height:100%;" aria-label="Tebak nada ini"><rect width="240" height="130" fill="none"/>${[20,40,60,80,100].map(y=>`<line x1="22" y1="${y}" x2="219" y2="${y}" stroke="#8da1b4" stroke-width="1.3"/>`).join('')}<text x="37" y="98" font-size="92" font-family="Georgia" fill="#b2c5df">𝄞</text>${(()=>{let step=(naturalStep(pitchInfo(midi).letter,pitchInfo(midi).octave)-naturalStep('E',4)),qy=100-step*10,lines='';if(qy>100){for(let a=120;a<=qy;a+=20)lines+=`<line x1="114" x2="154" y1="${a}" y2="${a}" stroke="#8da1b4"/>`;}if(qy<20){for(let a=0;a>=qy;a-=20)lines+=`<line x1="114" x2="154" y1="${a}" y2="${a}" stroke="#8da1b4"/>`;}return `${lines}<ellipse cx="135" cy="${qy}" rx="12" ry="7.5" transform="rotate(-18 135 ${qy})" fill="#6ce6d6"/><line x1="145" y1="${qy-3}" x2="145" y2="${qy-47}" stroke="#6ce6d6" stroke-width="2"/>`})()}</svg>`}
function renderLearning(){let lesson=state.lesson;$$('.lesson-tab').forEach(b=>b.classList.toggle('active',b.dataset.lesson===lesson));const texts={notes:'Klik sebuah nada. Perhatikan letaknya di garis paranada dan tuts piano.',chords:'Chord dibuat dari beberapa nada yang dimainkan bersamaan. Coba ganti chord di Piano Studio.',rhythm:'Kenali lama bunyi not. Tekan contoh untuk mendengarkan ketukannya.'};$('#lesson-intro').textContent=texts[lesson];let svg=`<rect x="0" y="0" width="750" height="315" fill="#f1f5fa" rx="12"/>${drawStaffLines(112,700)}<text x="20" y="75" class="staff-label">TREBLE</text><text x="22" y="204" class="staff-label">BASS</text><text x="66" y="158" font-size="89" font-family="Georgia" fill="#253c58">𝄞</text><text x="75" y="288" font-size="84" font-family="Georgia" fill="#253c58">𝄢</text>`;
 if(lesson==='notes'){let m=state.lessonNote,clef=m<60?'bass':'treble';svg+=`<circle cx="370" cy="${staffY(m,clef)}" r="34" fill="#5ae2d1" opacity=".12"/>${noteSvg(m,370,clef,true,1.12)}<text x="516" y="155" font-size="38" font-family="Inter,Segoe UI,sans-serif" font-weight="800" fill="#23435d">${shortName(m)}</text><text x="517" y="178" class="staff-label">${clef==='bass'?'TANGAN KIRI':'TANGAN KANAN'}</text>`;}
 if(lesson==='chords'){const c=currentChord(),notes=midiNotes(c);notes.left.forEach((m,i)=>svg+=noteSvg(m,300+i*23,'bass',true,.84));notes.right.forEach((m,i)=>svg+=noteSvg(m,380+i*24,'treble',true,.84));svg+=`<text x="530" y="158" font-size="32" font-weight="800" fill="#25435b">${chordText(c)}</text>`;}
 if(lesson==='rhythm'){svg+=`<text x="155" y="140" font-size="110" font-family="Georgia" fill="#263650">𝅝</text><text x="317" y="140" font-size="108" font-family="Georgia" fill="#263650">𝅗𝅥</text><text x="478" y="140" font-size="108" font-family="Georgia" fill="#263650">♩</text><text x="624" y="140" font-size="109" font-family="Georgia" fill="#263650">♪</text>${[['1 not penuh',158],['1/2 not',310],['1/4 not',473],['1/8 not',613]].map(([t,x])=>`<text x="${x}" y="183" class="staff-label" text-anchor="middle">${t}</text>`).join('')}`;}
 svg+='<text x="114" y="303" class="staff-tiny">NOTASI STANDAR • GARIS DAN SPASI</text>';$('#staff-svg').innerHTML=svg;
 if(lesson==='notes'){$('#note-picker').innerHTML=[48,50,52,53,55,57,59,60,62,64,65,67,69,71,72].map(m=>`<button data-lesson-note="${m}" class="${state.lessonNote===m?'active':''}">${shortName(m)}</button>`).join('');$('#lesson-explain').innerHTML=`<b>${shortName(state.lessonNote)}: ${state.lessonNote<60?'kunci F / bass':'kunci G / treble'}.</b> Lima garis paranada dibaca dari bawah ke atas. Kalau not bergerak naik satu spasi/garis, namanya juga naik satu tingkat. Klik not lain untuk melihat perbedaannya.`;}
 if(lesson==='chords'){$('#note-picker').innerHTML=`<button id="lesson-play-chord">▶ Dengarkan ${chordText(currentChord())}</button><button id="lesson-go-studio">Buka Piano Studio ↗</button>`;$('#lesson-explain').innerHTML=`<b>Chord ${chordText(currentChord())}</b> — tangan kiri: ${midiNotes(currentChord()).left.map(shortName).join(', ')}. Tangan kanan: ${midiNotes(currentChord()).right.map(shortName).join(', ')}. Not ditampilkan pada dua paranada.`;}
 if(lesson==='rhythm'){$('#note-picker').innerHTML=[{label:'4 ketuk',beats:4},{label:'2 ketuk',beats:2},{label:'1 ketuk',beats:1},{label:'½ ketuk',beats:.5}].map(o=>`<button data-beats="${o.beats}">▶ ${o.label}</button>`).join('');$('#lesson-explain').innerHTML='<b>Dalam birama 4/4:</b> not penuh = 4 ketuk, setengah = 2, seperempat = 1, seperdelapan = setengah ketuk. Gunakan tempo yang stabil untuk merasakannya.';}
 renderQuiz();}
function renderQuiz(){const q=state.quiz;$('#quiz-streak').textContent=q.streak+' benar berturut-turut';$('#quiz-score').textContent=q.correct+' / '+q.total;$('#quiz-note').innerHTML=quizSvg(q.midi);const opts=new Set([mod(q.midi)]);for(let k=1;opts.size<4;k++){opts.add(mod(q.midi+k*2+1))}const possible=[...opts].sort((a,b)=>a-b);$('#quiz-options').innerHTML=possible.map(pc=>`<button data-answer="${pc}" ${q.answered?'disabled':''} class="${q.answered?(pc===mod(q.midi)?'correct':''):''}">${noteName(pc)}</button>`).join('');}
function nextQuiz(){const candidates=[60,62,64,65,67,69,71,72,74,76];let before=state.quiz.midi;let next=candidates[Math.floor(Math.random()*candidates.length)];if(next===before)next=candidates[(candidates.indexOf(next)+3)%candidates.length];state.quiz.midi=next;state.quiz.answered=false;renderQuiz();$('#quiz-feedback').textContent='Pilih jawaban untuk mulai.'}
function checkAnswer(pc){let q=state.quiz;if(q.answered)return;let good=pc===mod(q.midi);q.total++;q.correct+=good?1:0;q.streak=good?q.streak+1:0;q.answered=true;renderQuiz();const button=$(`#quiz-options [data-answer="${pc}"]`);if(button&&!good)button.classList.add('incorrect');$('#quiz-feedback').textContent=good?'Pas! Itu nada '+shortName(q.midi)+'.':'Belum tepat. Jawabannya '+shortName(q.midi)+'. Coba soal berikutnya.';if(good)playNote(q.midi)}
function playRhythm(beats){const bpm=100,ctx=audioContext();if(!ctx)return;const start=ctx.currentTime+.03,tick=60/bpm;for(let i=0;i<4;i++){tone(i===0?84:79,start+i*tick,.1,.11)}tone(60,start,Math.max(.25,beats*tick*.9),.25);toast(`Nada ditahan ${beats} ketuk · tempo ${bpm} BPM`)}
// ------------------------------------------------------------
// CHEAT SHEET: a concise, interactive reference in our own design.
// ------------------------------------------------------------
const INTERVAL_NAMES=['Unison','Minor 2nd','Major 2nd','Minor 3rd','Major 3rd','Perfect 4th','Tritone','Perfect 5th','Minor 6th','Major 6th','Minor 7th','Major 7th','Octave'];
const MODE_REFERENCES=[
 {name:'Ionian',degree:0,steps:[0,2,4,5,7,9,11],desc:'Mayor yang stabil',scale:'major'},
 {name:'Dorian',degree:1,steps:[0,2,3,5,7,9,10],desc:'Minor · nada 6 terang',scale:'dorian'},
 {name:'Phrygian',degree:2,steps:[0,1,3,5,7,8,10],desc:'Minor yang gelap',scale:'phrygian'},
 {name:'Lydian',degree:3,steps:[0,2,4,6,7,9,11],desc:'Mayor · #4',scale:'lydian'},
 {name:'Mixolydian',degree:4,steps:[0,2,4,5,7,9,10],desc:'Dominant / funky',scale:'mixolydian'},
 {name:'Aeolian',degree:5,steps:[0,2,3,5,7,8,10],desc:'Natural minor',scale:'minor'},
 {name:'Locrian',degree:6,steps:[0,1,3,5,6,8,10],desc:'Diminished / tegang',scale:'locrian'}
];
function renderCheatSheet(){
 const s=scaleSteps(),minor=['minor','harmonic_minor','melodic_minor'].includes(state.scale),key=noteName(state.key);
 $('#cheat-key').textContent=key+' '+SCALES[state.scale].label;
 $('#cheat-relative').textContent=minor?'Relatif mayor: '+noteName(state.key+3)+' mayor':'Relatif minor: '+noteName(state.key+9)+' minor';
 $('#cheat-scale').innerHTML=s.map((step,i)=>`<button class="cheat-note" data-cheat-note="${60+state.key+step}"><b>${noteName(state.key+step)}</b><small>${i+1}</small></button>`).join('');
 $('#cheat-degree').innerHTML=s.map((step,i)=>`<span>${i+1} = ${step} semitone</span>`).join('');
 $('#cheat-intervals').innerHTML=INTERVAL_NAMES.map((name,i)=>`<button class="interval-row" data-cheat-note="${60+state.key+i}"><span>${i} semitone</span><b>${name}</b><strong>${noteName(state.key+i)}</strong></button>`).join('');
 const romans=minor?ROM_MINOR:ROM_MAJOR;
 const triples=s.map((_,i)=>{
  const triad=chordObj(state.key+s[i],degreeQuality(s,i,'major'));
  const intervals=[0,2,4,6].map(d=>s[(i+d)%7]+(i+d>=7?12:0)-s[i]);
  const sev=(intervals[1]===4&&intervals[2]===7&&intervals[3]===11)?'maj7':(intervals[1]===3&&intervals[2]===7&&intervals[3]===10)?'m7':(intervals[1]===3&&intervals[2]===6&&intervals[3]===10)?'m7b5':(intervals[1]===4&&intervals[3]===10)?'7':'dim7';
  return {triad,seventh:chordObj(triad.root,sev)};
 });
 $('#cheat-diatonic').innerHTML=triples.map((x,i)=>`<div class="cheat-chord-row"><b>${romans[i]}</b><button data-cheat-chord="${i}-0">${chordText(x.triad)} <small>${chordTones(x.triad).map(noteName).join(' · ')}</small></button><button data-cheat-chord="${i}-1">${chordText(x.seventh)} <small>${chordTones(x.seventh).map(noteName).join(' · ')}</small></button></div>`).join('');
 const base=state.key;
 $('#cheat-modes').innerHTML=MODE_REFERENCES.map((m,i)=>`<button class="mode-card" data-mode-index="${i}"><span class="mode-index">0${i+1}</span><b>${noteName(base+s[i])} ${m.name}</b><small>${m.desc}</small><span>${m.steps.map(v=>noteName(base+s[i]+v)).join(' · ')}</span></button>`).join('');
 $('#cheat-diatonic').onclick=e=>{const btn=e.target.closest('[data-cheat-chord]');if(!btn)return;const [i,seven]=btn.dataset.cheatChord.split('-').map(Number);const c=seven?triples[i].seventh:triples[i].triad;playChord(c);state.root=c.root;state.quality=c.quality;state.bass=-1;$('#root-note').value=c.root;$('#chord-quality').value=c.quality;$('#bass-note').value=-1;renderStudio()};
 $('#cheat-modes').onclick=e=>{const btn=e.target.closest('[data-mode-index]');if(!btn)return;const m=MODE_REFERENCES[Number(btn.dataset.modeIndex)];let root=base+s[m.degree];changeKey(root,m.scale);playNote(60+mod(root))};
}

// ------------------------------------------------------------
// TRANSKRIPSI LOKAL: MIDI import, single-pitch estimate, note editor.
// Audio tab hanya melalui getDisplayMedia dengan persetujuan pengguna; tidak membaca iframe lintas-origin.
// ------------------------------------------------------------
const rollState={notes:[],seconds:16,playing:false,timers:[],raf:0,playStarted:0,playBase:0,playhead:-2.8,rate:1,objectURL:null,sourceBuffer:null,filename:'',worker:null,sourcePCM:null,sourceRate:11025};
const ROLL_H=20,ROLL_LOW=21,ROLL_HIGH=108;
const FALL_W=26,FALL_B=17,FALL_H=380,FALL_LOW=21,FALL_HIGH=108,FALL_LOOKAHEAD=3.15;
const fallWhites=Array.from({length:FALL_HIGH-FALL_LOW+1},(_,i)=>FALL_LOW+i).filter(n=>![1,3,6,8,10].includes(n%12));
const fallAll=Array.from({length:FALL_HIGH-FALL_LOW+1},(_,i)=>FALL_LOW+i);
const FALL_WIDTH=fallWhites.length*FALL_W;
let fallLastActive='',fallCanvasReady=false;
function fallPosition(midi){
 const idx=fallWhites.indexOf(midi);if(idx>=0)return {x:idx*FALL_W,w:FALL_W,black:false};
 const before=fallWhites.filter(n=>n<midi).length;return {x:before*FALL_W-FALL_B/2,w:FALL_B,black:true};
}
function setupFallingKeyboard(){
 if(fallCanvasReady)return;const canvas=$('#fall-canvas'), keys=$('#fall-keys');
 if(!canvas||!keys)return;
 canvas.width=FALL_WIDTH;canvas.height=FALL_H;canvas.style.width=FALL_WIDTH+'px';canvas.style.height=FALL_H+'px';
 const stage=$('#fall-stage');stage.style.width=FALL_WIDTH+'px';keys.style.width=FALL_WIDTH+'px';
 for(const midi of fallWhites){const position=fallPosition(midi),b=document.createElement('button');
  b.className='fall-white-key';b.type='button';b.dataset.fallMidi=midi;
  b.style.left=position.x+'px';b.style.width=position.w+'px';
  b.title=shortName(midi);b.textContent=mod(midi)===0?shortName(midi):'';keys.appendChild(b);}
 for(const midi of fallAll.filter(m=>[1,3,6,8,10].includes(m%12))){const position=fallPosition(midi),b=document.createElement('button');
  b.className='fall-black-key';b.type='button';b.dataset.fallMidi=midi;
  b.style.left=position.x+'px';b.style.width=position.w+'px';b.title=shortName(midi);keys.appendChild(b);}
 keys.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-fall-midi]');if(!b)return;e.preventDefault();const midi=Number(b.dataset.fallMidi);playNote(midi);b.classList.add('is-active');setTimeout(()=>{if(!rollState.playing)b.classList.remove('is-active')},300);});
 fallCanvasReady=true;requestAnimationFrame(()=>jumpToPiano('mid','fall'));
}
function fallTime(sec){const x=Math.max(0,sec);return String(Math.floor(x/60)).padStart(2,'0')+':'+String(Math.floor(x%60)).padStart(2,'0')}
function fallDuration(){return rollState.notes.length?Math.max(1,rollState.notes.reduce((max,n)=>Math.max(max,n.start+n.duration),0)):Math.max(16,rollState.seconds);}
function drawFallingRoll(){
 const canvas=$('#fall-canvas');if(!canvas||!fallCanvasReady)return;
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const w=FALL_WIDTH,h=FALL_H,now=rollState.playhead,pps=h/FALL_LOOKAHEAD;
 ctx.clearRect(0,0,w,h);
 const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#0c142b');bg.addColorStop(1,'#0c2132');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 for(let i=0;i<fallWhites.length;i++){if(i%2===0){ctx.fillStyle='#18273d55';ctx.fillRect(i*FALL_W,0,FALL_W,h)}ctx.strokeStyle='#2c46635e';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(i*FALL_W+.5,0);ctx.lineTo(i*FALL_W+.5,h);ctx.stroke();}
 for(const n of fallAll.filter(x=>[1,3,6,8,10].includes(x%12))){const {x,w:width}=fallPosition(n);ctx.fillStyle='#050a1b66';ctx.fillRect(x,0,width,h);}
 const first=Math.max(-4,Math.ceil(now));for(let sec=first;sec<=now+FALL_LOOKAHEAD;sec++){
  const y=h-(sec-now)*pps;if(y<0||y>h)continue;ctx.strokeStyle=sec%4===0?'#7a92be55':'#67819d22';ctx.lineWidth=sec%4===0?1.4:1;
  ctx.beginPath();ctx.moveTo(0,y+.5);ctx.lineTo(w,y+.5);ctx.stroke();
  if(sec>=0&&sec%4===0){ctx.fillStyle='#8baacc';ctx.font='11px system-ui';ctx.fillText(fallTime(sec),8,Math.max(13,y-5));}}
 for(const n of rollState.notes){if(n.midi<FALL_LOW||n.midi>FALL_HIGH)continue;
  const yBottom=h-(n.start-now)*pps, yTop=h-(n.start+n.duration-now)*pps;
  if(yBottom<0||yTop>h)continue;
  const pos=fallPosition(n.midi),x=pos.x+2,width=pos.w-4,top=Math.max(-2,yTop),bottom=Math.min(h+2,yBottom),height=Math.max(0,bottom-top);
  if(height<1)continue;
  const active=n.start<=now&&now<n.start+n.duration,low=n.midi<60,manual=n.source==='manual';
  let topColor=manual?'#ffcc85':low?'#9ad2ff':'#c9a6ff',baseColor=manual?'#e98a43':low?'#338cd3':'#8a58d9';
  const grad=ctx.createLinearGradient(x,top,x+width,top);grad.addColorStop(0,baseColor);grad.addColorStop(.55,topColor);grad.addColorStop(1,baseColor);
  ctx.fillStyle=grad;ctx.shadowBlur=active?18:6;ctx.shadowColor=manual?'#ffbd75bb':low?'#5daafc88':'#c493ff88';
  ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,top,width,height,Math.min(5,height/2));else ctx.rect(x,top,width,height);ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle='#ffffff7a';ctx.fillRect(x+2,top+2,Math.max(1,width-4),Math.min(2,height-2));
  if(height>30&&width>24){ctx.fillStyle='#101526';ctx.font='bold 10px system-ui';ctx.fillText(noteName(n.midi),x+4,Math.min(bottom-5,top+17));}
 }
 ctx.shadowColor='#58ebdc';ctx.shadowBlur=14;ctx.fillStyle='#65ffdf';ctx.fillRect(0,h-3,w,3);ctx.shadowBlur=0;
 const activeNotes=rollState.playing?rollState.notes.filter(n=>n.start<=now&&now<n.start+n.duration).map(n=>n.midi):[];
 const activeSet=new Set(activeNotes),signature=[...activeSet].sort((a,b)=>a-b).join(',');
 if(signature!==fallLastActive){$$('#fall-keys [data-fall-midi]').forEach(b=>b.classList.toggle('is-active',activeSet.has(Number(b.dataset.fallMidi))));fallLastActive=signature;}
 const end=fallDuration();$('#fall-current-time').textContent=fallTime(now)+' / '+fallTime(end);
 const seek=$('#fall-seek');seek.max=String(end);if(!seek.matches(':active'))seek.value=String(Math.max(0,Math.min(now,end)));
 $('#fall-counter').textContent=now<0?String(Math.ceil(-now))+' · mulai':rollState.playing?'● BERJALAN':'● SIAP';
}
function renderRoll(){
 const zoom=Number($('#roll-zoom').value),bpm=Math.max(40,Math.min(240,Number($('#roll-bpm').value)||110)),length=Math.max(16,rollState.seconds+2),width=Math.ceil(length*zoom),height=(ROLL_HIGH-ROLL_LOW+1)*ROLL_H;
 const beat=60/bpm,beats=Math.ceil(length/beat);
 let grid=`<div class="roll-background" style="width:${width}px;height:${height}px"></div>`;
 for(let note=ROLL_HIGH;note>=ROLL_LOW;note--){const y=(ROLL_HIGH-note)*ROLL_H;grid+=`<div class="roll-row ${[1,3,6,8,10].includes(note%12)?'sharprow':''}" style="top:${y}px;width:${width}px"><span class="roll-note-label">${shortName(note)}</span></div>`}
 for(let i=0;i<=beats;i++){const x=i*beat*zoom;grid+=`<div class="roll-beat ${i%4===0?'is-bar':''}" style="left:${x}px;height:${height}px">${i%4===0?'<span class="roll-bar-number">'+(Math.floor(i/4)+1)+'</span>':''}</div>`}
 rollState.notes.forEach((n,i)=>{const x=Math.max(0,n.start*zoom),w=Math.max(9,n.duration*zoom-2),y=(ROLL_HIGH-n.midi)*ROLL_H+2;if(n.midi<ROLL_LOW||n.midi>ROLL_HIGH)return;grid+=`<button class="roll-note ${n.source==='manual'?'manual':''}" data-roll-note="${i}" style="left:${x}px;top:${y}px;width:${w}px;height:${ROLL_H-3}px" title="${shortName(n.midi)} · ${n.start.toFixed(2)}s (klik hapus)">${shortName(n.midi)}</button>`});
 grid+=`<div id="roll-playhead" class="roll-playhead" style="left:${rollState.playhead*zoom}px;height:${height}px"></div>`;
 const el=$('#roll-track');el.style.width=width+'px';el.style.height=height+'px';el.innerHTML=grid;
 $('#roll-info').textContent=`${rollState.notes.length} nada · ${Math.round(length)} detik · editor tersedia`;
 setupFallingKeyboard();drawFallingRoll();
}
function addRollNote(midi,start,duration=null,source='manual'){
 if(!Number.isFinite(midi)||!Number.isFinite(start)||midi<ROLL_LOW||midi>ROLL_HIGH)return;
 const bpm=Math.max(40,Math.min(240,Number($('#roll-bpm').value)||110)),beat=60/bpm;
 rollState.notes.push({midi:Math.round(midi),start:Math.round(Math.max(0,start)/beat*4)/4*beat,duration:duration||beat,source});
 rollState.notes.sort((a,b)=>a.start-b.start||a.midi-b.midi);
 rollState.seconds=Math.min(240,Math.max(rollState.seconds,start+(duration||beat)+1));renderRoll();
}
function stopRoll(){
 rollState.playing=false;for(const t of rollState.timers)clearTimeout(t);rollState.timers=[];
 cancelAnimationFrame(rollState.raf);rollState.raf=0;
 $('#roll-play').textContent='▶ Putar';fallLastActive='__stopped__';drawFallingRoll();
}
function playRoll(){
 if(rollState.playing){stopRoll();$('#roll-play').textContent='▶ Lanjutkan';return;}
 if(!rollState.notes.length){toast('Belum ada nada. Klik Contoh atau impor MIDI dulu.');return;}
 const ctx=audioContext();if(!ctx)return;
 stopRoll();const end=fallDuration();if(rollState.playhead>=end)rollState.playhead=-2.8;
 // Countdown makes the first bars visible as they fall toward the keys.
 if(rollState.playhead===0)rollState.playhead=-2.8;
 const begin=rollState.playhead,rate=rollState.rate;
 rollState.playing=true;$('#roll-play').textContent='❚❚ Jeda';rollState.playBase=begin;rollState.playStarted=performance.now();
 for(const n of rollState.notes){
  const noteEnd=n.start+n.duration;
  if(noteEnd<=begin || n.start>end)continue;
  const startDelay=Math.max(0,(n.start-begin)/rate)*1000;
  const remaining=Math.min(n.duration,noteEnd-Math.max(begin,n.start));
  const t=setTimeout(()=>{if(!rollState.playing)return;tone(n.midi+state.transpose,null,Math.max(.12,remaining/rate),.28);flashKey(n.midi);},startDelay);
  rollState.timers.push(t);
 }
 const frame=()=>{
  if(!rollState.playing)return;
  rollState.playhead=rollState.playBase+(performance.now()-rollState.playStarted)/1000*rollState.rate;
  const marker=$('#roll-playhead');if(marker)marker.style.left=(Math.max(0,rollState.playhead)*Number($('#roll-zoom').value))+'px';
  drawFallingRoll();
  if(rollState.playhead>=end+.35){stopRoll();rollState.playhead=end;drawFallingRoll();return;}
  rollState.raf=requestAnimationFrame(frame);
 };frame();
}
function demoRoll(){
 stopRoll();rollState.notes=[];
 // Original four-bar example with left-hand bass, right-hand chords and a melody.
 const bars=[{bass:48,fifth:55,chord:[60,64,67,71],melody:[72,74,76,79]},
             {bass:45,fifth:52,chord:[57,60,64,69],melody:[76,74,72,69]},
             {bass:41,fifth:48,chord:[53,57,60,64],melody:[69,72,76,72]},
             {bass:43,fifth:50,chord:[55,59,62,65],melody:[71,74,77,74]}];
 const beat=60/110,add=(midi,start,duration)=>rollState.notes.push({midi,start,duration,source:'analyzed'});
 bars.forEach((b,i)=>{let t=i*beat*4;add(b.bass,t,beat*3.7);add(b.fifth,t,beat*2);
  b.chord.forEach(m=>add(m,t,beat*1.6));b.melody.forEach((m,k)=>add(m,t+k*beat,beat*.85));});
 rollState.notes.sort((a,b)=>a.start-b.start||a.midi-b.midi);
 rollState.seconds=16;rollState.playhead=-2.8;renderRoll();
 document.querySelector('.roll-panel')?.scrollIntoView({behavior:'smooth',block:'start'});
 toast('Contoh lagu dua tangan siap. Klik Putar untuk melihat nada turun.');
}
function exportRollMidi(){
 if(!rollState.notes.length){toast('Belum ada nada untuk diekspor.');return}
 const bpm=Math.max(40,Math.min(240,Number($('#roll-bpm').value)||110)),ppq=480,mpq=Math.round(60000000/bpm),ticksPerSecond=ppq*bpm/60,events=[{t:0,priority:0,bytes:[0xFF,0x51,3,(mpq>>16)&255,(mpq>>8)&255,mpq&255]},{t:0,priority:0,bytes:[0xC0,0]}];
 for(const n of rollState.notes){const on=Math.round(n.start*ticksPerSecond),off=Math.round((n.start+n.duration)*ticksPerSecond);events.push({t:on,priority:1,bytes:[0x90,n.midi,85]},{t:off,priority:0,bytes:[0x80,n.midi,0]})}
 events.sort((a,b)=>a.t-b.t||a.priority-b.priority);let tr=[],t=0;
 for(const e of events){tr.push(...midiVar(e.t-t),...e.bytes);t=e.t}tr.push(0,0xff,0x2f,0);
 const d=x=>[(x>>>24)&255,(x>>>16)&255,(x>>>8)&255,x&255];
 downloadFile('Chord_Atlas_Piano_Roll.mid',new Uint8Array([...Array.from('MThd').map(c=>c.charCodeAt(0)),...d(6),0,0,0,1,(ppq>>8)&255,ppq&255,...Array.from('MTrk').map(c=>c.charCodeAt(0)),...d(tr.length),...tr]),'audio/midi');toast('Piano roll tersimpan sebagai MIDI.');
}
function readMidiNotes(arraybuffer){
 const v=new DataView(arraybuffer);let p=0;const byte=()=>v.getUint8(p++),u16=()=>{let a=v.getUint16(p);p+=2;return a},u32=()=>{let a=v.getUint32(p);p+=4;return a},str=n=>{let a='';for(let i=0;i<n;i++)a+=String.fromCharCode(byte());return a};
 const vlq=()=>{let n=0,b=0;do{b=byte();n=(n<<7)|(b&127)}while((b&128)&&p<v.byteLength);return n};
 if(str(4)!=='MThd')throw Error('Bukan file MIDI.');const hsize=u32(),format=u16(),ntr=u16(),division=u16();p=8+hsize;
 if(division&0x8000)throw Error('MIDI SMPTE belum didukung.');
 let events=[],tempos=[{tick:0,us:500000}];
 for(let tr=0;tr<ntr;tr++){
  if(str(4)!=='MTrk')break;const size=u32(),limit=p+size;let tick=0,runStatus=0;const playing=new Map();
  while(p<limit){tick+=vlq();let status=byte();if(status<0x80){p--;status=runStatus;}else if(status<0xf0)runStatus=status;
   if(status===0xff){const kind=byte(),len=vlq();if(kind===0x51&&len===3){const us=(byte()<<16)|(byte()<<8)|byte();tempos.push({tick,us});}else p+=len;continue;}
   if(status===0xf0||status===0xf7){p+=vlq();continue;}
   const type=status&0xf0,chan=status&0x0f;if(type===0x90||type===0x80){const midi=byte(),vel=byte(),key=chan+':'+midi;
    if(type===0x90&&vel>0){playing.set(key,{tick,midi})}else if(playing.has(key)){const note=playing.get(key);events.push({...note,endTick:tick});playing.delete(key)}}
   else if(type===0xc0||type===0xd0)p++;
   else if([0xa0,0xb0,0xe0].includes(type))p+=2;
   else throw Error('Event MIDI tidak dikenali.');
  }p=limit;
 }
 tempos.sort((a,b)=>a.tick-b.tick);const timeAt=tick=>{let at=0,old=0,rate=500000;for(const ev of tempos){if(ev.tick>tick)break;at+=(ev.tick-old)/division*rate/1000000;old=ev.tick;rate=ev.us}return at+(tick-old)/division*rate/1000000};
 return events.map(e=>({midi:e.midi,start:timeAt(e.tick),duration:Math.max(.08,timeAt(e.endTick)-timeAt(e.tick)),source:'analyzed'})).filter(e=>e.midi>=ROLL_LOW&&e.midi<=ROLL_HIGH).slice(0,2500);
}
function openReference(){
 const raw=$('#source-link').value.trim(),target=$('#video-container');target.hidden=true;target.replaceChildren();
 if(!raw)return toast('Tempel link YouTube atau Instagram.');
 let url;try{url=new URL(raw)}catch{return toast('Format link tidak valid.')}if(url.protocol!=='https:')return toast('Gunakan link https.');
 const host=url.hostname.toLowerCase().replace(/^www\./,'');
 if(['youtube.com','m.youtube.com','youtu.be','music.youtube.com'].includes(host)){
  const id=host==='youtu.be'?url.pathname.slice(1).split('/')[0]:url.searchParams.get('v')||url.pathname.match(/\/(?:shorts|embed|live)\/([^/]+)/)?.[1];
  if(!id||!/^[\w-]{11}$/.test(id))return toast('ID video YouTube tidak ditemukan.');
  const directLink='https://www.youtube.com/watch?v='+id;
  const local=location.protocol==='file:';
  const out=document.createElement('div');out.className='reference-actions';
  const a=document.createElement('a');a.className='reference-open';a.href=directLink;a.target='_blank';a.rel='noopener noreferrer';a.textContent='▶ Buka video di YouTube ↗';out.appendChild(a);
  const tip=document.createElement('span');tip.textContent=local?'File lokal: YouTube tidak mengizinkan pemutar tertanam tanpa alamat situs.':'Kalau pemutar ditolak YouTube, gunakan tombol buka video.';out.appendChild(tip);
  if(!local){
    const frame=document.createElement('iframe');
    const origin=location.origin&&location.origin!=='null'?'?origin='+encodeURIComponent(location.origin):'';
    frame.src='https://www.youtube.com/embed/'+id+origin;
    frame.title='Video referensi YouTube';frame.referrerPolicy='strict-origin-when-cross-origin';
    frame.setAttribute('allow','accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');frame.allowFullscreen=true;
    target.appendChild(frame);
  }else{
    const message=document.createElement('div');message.className='video-file-message';
    message.innerHTML='<div class="video-file-icon">▶</div><strong>Video dibuka melalui YouTube</strong><p>Aplikasi sedang dijalankan dari folder lokal. Gunakan tombol di bawah supaya tidak muncul Error 153.</p>';
    target.appendChild(message);
  }
  target.appendChild(out);target.hidden=false;
  $('#source-feedback').textContent='Video sudah dibuka. Klik Tangkap Audio Tab, lalu pilih tab ini pada dialog Chrome dan aktifkan Bagikan audio tab.';
 }else if(host==='instagram.com'||host==='instagr.am'){
  if(!/^\/(reel|p|tv)\//.test(url.pathname))return toast('Gunakan link post atau Reel Instagram.');
  const out=document.createElement('div');out.className='reference-actions instagram-reference';
  const a=document.createElement('a');a.className='reference-open';a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Buka video di Instagram ↗';out.appendChild(a);
  target.appendChild(out);target.hidden=false;
  $('#source-feedback').textContent='Instagram sudah dibuka. Gunakan Tangkap Audio Tab untuk merekam suara tab dengan izin Chrome.';
 }else toast('Yang didukung: YouTube dan Instagram.');
}
// Audio tab sengaja hanya diakses setelah pengguna memilih sumber dalam dialog Chrome.
// Tidak memakai URL streaming/downloader/proxy. Ditujukan untuk audio yang berhak pengguna analisis.
const captureState={stream:null,ctx:null,source:null,proc:null,mute:null,monitor:null,segments:[],frames:0,phase:0,start:0,timer:null,stopping:false,lastPeak:0};
const CAPTURE_RATE=11025,CAPTURE_LIMIT_SEC=300;
function captureMessage(message){const el=$('#capture-status');if(el)el.textContent=message}
function captureUI(recording){$('#capture-start').disabled=recording;$('#capture-stop').disabled=!recording;$('#tab-capture-panel').classList.toggle('is-recording',recording)}
async function startTabCapture(){
 if(captureState.stream)return;
 if(!navigator.mediaDevices?.getDisplayMedia){captureMessage('Browser tidak mendukung berbagi audio tab. Buka situs melalui HTTPS di Chrome/Edge desktop, atau impor file audio/MIDI.');return;}
 // Harus dipanggil langsung dari klik pengguna, sebelum await lainnya.
 let stream;
 try{stream=await navigator.mediaDevices.getDisplayMedia({video:true,audio:true,systemAudio:'exclude',selfBrowserSurface:'exclude'});}
 catch(err){captureMessage(err.name==='NotAllowedError'?'Izin berbagi tab dibatalkan. Klik Tangkap Audio Tab untuk mencoba lagi.':'Tidak dapat membuka pemilih tab: '+err.message);return;}
 if(stream.getAudioTracks().length===0){stream.getTracks().forEach(t=>t.stop());captureMessage('Tidak ada audio! Pilih Chrome Tab, pilih video YouTube, dan aktifkan “Bagikan audio tab / Share tab audio”. Jangan pilih Seluruh layar.');return;}
 try{
  const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)throw Error('Web Audio tidak tersedia.');
  const ctx=new Ctx();await ctx.resume();
  const src=ctx.createMediaStreamSource(new MediaStream(stream.getAudioTracks()));
  const proc=ctx.createScriptProcessor(4096,1,1);
  const mute=ctx.createGain();mute.gain.value=0;
  const monitor=ctx.createGain();monitor.gain.value=.95;
  captureState.stream=stream;captureState.ctx=ctx;captureState.source=src;captureState.proc=proc;captureState.mute=mute;captureState.monitor=monitor;
  captureState.segments=[];captureState.frames=0;captureState.phase=0;captureState.stopping=false;captureState.lastPeak=0;captureState.start=performance.now();
  let stride=ctx.sampleRate/CAPTURE_RATE;
  proc.onaudioprocess=e=>{
   if(captureState.stopping)return;
   const input=e.inputBuffer.getChannelData(0),out=e.outputBuffer.getChannelData(0);out.fill(0);
   const down=new Float32Array(Math.ceil(input.length/stride)+2);let used=0,peak=0;
   for(let i=0;i<input.length;i++){let v=input[i];peak=Math.max(peak,Math.abs(v));captureState.phase+=1;if(captureState.phase>=stride){captureState.phase-=stride;down[used++]=v;}}
   if(used){captureState.segments.push(down.subarray(0,used));captureState.frames+=used;}
   captureState.lastPeak=peak;
  };
  src.connect(proc);proc.connect(mute);mute.connect(ctx.destination);
  // Saat tab dibagikan Chrome mungkin menonaktifkan suara pada tab sumber.
  // Monitor lokal mempertahankan suara agar pengguna dapat mendengar videonya.
  src.connect(monitor);monitor.connect(ctx.destination);
  stream.getTracks().forEach(t=>t.addEventListener('ended',()=>{if(captureState.stream&&!captureState.stopping)finishTabCapture()}, {once:true}));
  captureUI(true);$('#analysis-progress').value=0;$('#capture-elapsed').textContent='00:00';
  captureMessage('Merekam suara tab… Putar video di tab YouTube. Kembali ke CHORD ATLAS setelah bagian yang ingin dianalisis selesai. Maksimal 5 menit.');
  captureState.timer=setInterval(()=>{
   let sec=(performance.now()-captureState.start)/1000;
   $('#capture-elapsed').textContent=fallTime(sec);
   $('#capture-meter-fill').style.width=Math.min(100,Math.round(Math.sqrt(captureState.lastPeak)*100))+'%';
   if(sec>=CAPTURE_LIMIT_SEC)finishTabCapture();
  },180);
 }catch(err){stream.getTracks().forEach(t=>t.stop());captureUI(false);captureMessage('Gagal menerima suara dari tab: '+err.message);try{await captureState.ctx?.close()}catch(_){ }captureState.stream=null;}
}
function makeWav(pcm,rate){
 const wav=new ArrayBuffer(44+pcm.length*2),v=new DataView(wav),s=(n,t)=>{for(let i=0;i<t.length;i++)v.setUint8(n+i,t.charCodeAt(i));};
 s(0,'RIFF');v.setUint32(4,36+pcm.length*2,true);s(8,'WAVE');s(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,rate,true);v.setUint32(28,rate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);s(36,'data');v.setUint32(40,pcm.length*2,true);
 for(let i=0;i<pcm.length;i++){let x=Math.max(-1,Math.min(1,pcm[i]));v.setInt16(44+i*2,x<0?x*32768:x*32767,true)}return wav;
}
async function finishTabCapture(){
 if(!captureState.stream||captureState.stopping)return;
 captureState.stopping=true;clearInterval(captureState.timer);
 const duration=captureState.frames/CAPTURE_RATE;
 // Lepaskan processor sebelum berhenti berbagi agar tidak ada sample duplikat.
 if(captureState.proc){captureState.proc.onaudioprocess=null;captureState.proc.disconnect();}
 for(const n of [captureState.source,captureState.mute,captureState.monitor])try{n?.disconnect()}catch(_){}
 captureState.stream.getTracks().forEach(t=>t.stop());
 try{await captureState.ctx?.close()}catch(_){}
 captureState.stream=null;captureState.ctx=null;captureUI(false);
 $('#capture-meter-fill').style.width='0%';
 if(duration<.7){captureMessage('Belum ada suara terekam. Ulangi dan putar video setelah memilih tab dengan Bagikan audio tab.');return;}
 const pcm=new Float32Array(captureState.frames);let at=0;
 for(const part of captureState.segments){pcm.set(part,at);at+=part.length;}
 captureState.segments=[];captureState.frames=0;
 const head=pcm.subarray(0,Math.min(150000,pcm.length));let energy=0;for(let i=0;i<head.length;i+=50)energy+=head[i]*head[i];
 if(energy/Math.max(1,Math.floor(head.length/50))<.000001){captureMessage('Audio tab berhasil dibagikan, tapi rekamannya sunyi. Pastikan video tidak mute, putar videonya, dan pilih “Bagikan audio tab”.');return;}
 rollState.sourcePCM=pcm;rollState.sourceRate=CAPTURE_RATE;rollState.sourceBuffer=null;rollState.filename='Audio tab ('+fallTime(duration)+')';
 if(rollState.objectURL)URL.revokeObjectURL(rollState.objectURL);
 rollState.objectURL=URL.createObjectURL(new Blob([makeWav(pcm,CAPTURE_RATE)],{type:'audio/wav'}));
 $('#audio-reference').src=rollState.objectURL;$('#analyze-audio').disabled=false;
 captureMessage('Berhasil merekam '+fallTime(duration)+' dari tab. Analisis dimulai; hasilnya akan masuk ke Piano Roll Jatuh.');
 $('#analysis-message').textContent='Audio tab diterima. Menganalisis perkiraan nada…';
 await analyzeUploadedAudio();
}
async function analyzeUploadedAudio(){
 const btn=$('#analyze-audio'),msg=$('#analysis-message'),prog=$('#analysis-progress');
 if(!rollState.sourceBuffer&&!rollState.sourcePCM)return toast('Pilih audio atau tangkap suara tab YouTube dahulu.');
 btn.disabled=true;btn.textContent='Menganalisis...';prog.value=0;msg.textContent='Membaca gelombang audio...';
 try{
  let raw,max;
  if(rollState.sourcePCM){max=Math.min(rollState.sourcePCM.length/rollState.sourceRate,CAPTURE_LIMIT_SEC);raw=rollState.sourcePCM.slice(0,Math.floor(max*rollState.sourceRate));}
  else{
   const ctx=audioContext();if(!ctx)throw Error('Web Audio belum didukung.');const decoded=await ctx.decodeAudioData(rollState.sourceBuffer.slice(0));
   const rate=11025,step=decoded.sampleRate/rate;max=Math.min(decoded.duration,CAPTURE_LIMIT_SEC);
   const count=Math.floor(max*rate);raw=new Float32Array(count);const channels=Array.from({length:decoded.numberOfChannels},(_,c)=>decoded.getChannelData(c));
   for(let i=0;i<count;i++){const j=Math.floor(i*step);let val=0;for(const arr of channels)val+=arr[j]||0;raw[i]=val/channels.length;}
  }
  msg.textContent='Mencari nada dominan (hingga 5 menit)…';
  const workerCode=`onmessage=e=>{const data=new Float32Array(e.data.buffer),rate=11025,hop=1102,win=1250;let frames=[];let total=Math.max(1,Math.ceil((data.length-win)/hop));let loud=0;for(let i=0;i<data.length;i+=120)loud=Math.max(loud,Math.abs(data[i]));
   for(let k=0;k<total;k++){let pos=k*hop,energy=0;for(let j=0;j<win;j+=3)energy+=data[pos+j]*data[pos+j];energy=Math.sqrt(energy/(win/3));
    if(energy<Math.max(.008,loud*.07)){frames.push(-1);continue}
    let best=-1,bestC=0;for(let lag=12;lag<=205;lag++){let dot=0,a=0,b=0;for(let j=0;j<win-lag;j+=4){let x=data[pos+j],y=data[pos+j+lag];dot+=x*y;a+=x*x;b+=y*y}let corr=dot/Math.sqrt(Math.max(1e-8,a*b));if(corr>.77&&corr>bestC){bestC=corr;best=lag}}
    let midi=best>0?Math.round(69+12*Math.log2(rate/best/440)):-1;frames.push(midi>=36&&midi<=84?midi:-1);
    if(k%30===0)postMessage({progress:Math.round(k/total*100)});
   }
   let notes=[],current=-1,from=0;const finish=k=>{if(current<0)return;let duration=(k-from)*hop/rate;if(duration>=.19)notes.push({midi:current,start:from*hop/rate,duration,source:'analyzed'})};
   for(let k=0;k<=frames.length;k++){let v=k===frames.length?-1:frames[k];if(k>0&&k<frames.length-1&&frames[k-1]===frames[k+1]&&v!==frames[k-1])v=frames[k-1];if(v!==current){finish(k);current=v;from=k}}
   postMessage({done:true,notes:notes.slice(0,450)});
  }`;
  const objectURL=URL.createObjectURL(new Blob([workerCode],{type:'application/javascript'}));
  const worker=new Worker(objectURL);rollState.worker=worker;
  const notes=await new Promise((resolve,reject)=>{worker.onmessage=e=>{if(e.data.progress!==undefined){prog.value=e.data.progress;msg.textContent='Membaca nada... '+e.data.progress+'%'}if(e.data.done)resolve(e.data.notes)};worker.onerror=reject;worker.postMessage({buffer:raw.buffer},[raw.buffer])});
  worker.terminate();rollState.worker=null;URL.revokeObjectURL(objectURL);
  stopRoll();rollState.notes=notes;rollState.seconds=Math.max(16,max);rollState.playhead=-2.8;renderRoll();prog.value=100;
  msg.textContent=`Selesai: ${notes.length} nada terdeteksi. Koreksi hasilnya di piano roll.`;document.querySelector('.roll-panel')?.scrollIntoView({behavior:'smooth',block:'start'});
  if(!notes.length)toast('Nada belum terbaca. Coba pilih tab bersuara atau bagian piano yang lebih jelas.');
 }catch(err){msg.textContent='Analisis gagal: '+err.message;toast('Audio tidak bisa dianalisis di browser ini.');}
 finally{btn.disabled=false;btn.textContent='♫ Deteksi melodi dari audio';}
}
function initTranscription(){
 renderRoll();$('#open-source').addEventListener('click',openReference);$('#capture-start').addEventListener('click',startTabCapture);$('#capture-stop').addEventListener('click',finishTabCapture);
 $('#source-speed').addEventListener('change',e=>$('#audio-reference').playbackRate=Number(e.target.value));
 $('#source-audio').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;if(rollState.objectURL)URL.revokeObjectURL(rollState.objectURL);rollState.objectURL=URL.createObjectURL(file);rollState.sourceBuffer=await file.arrayBuffer();rollState.sourcePCM=null;rollState.filename=file.name;
  $('#audio-reference').src=rollState.objectURL;$('#analyze-audio').disabled=false;$('#analysis-message').textContent=file.name+' · siap dianalisis';$('#analysis-progress').value=0;});
 $('#source-midi').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{const notes=readMidiNotes(await file.arrayBuffer());stopRoll();rollState.notes=notes;rollState.seconds=Math.min(240,Math.max(16,notes.reduce((v,n)=>Math.max(v,n.start+n.duration),0)+2));rollState.playhead=-2.8;renderRoll();$('#analysis-message').textContent=file.name+' · '+notes.length+' nada diimpor';toast('MIDI berhasil dibuka sebagai piano roll.');document.querySelector('.roll-panel')?.scrollIntoView({behavior:'smooth',block:'start'});}catch(err){toast('File MIDI gagal dibaca: '+err.message)}});
 $('#analyze-audio').addEventListener('click',analyzeUploadedAudio);
 $('#roll-play').addEventListener('click',playRoll);$('#roll-stop').addEventListener('click',()=>{stopRoll();rollState.playhead=-2.8;renderRoll()});
 $('#roll-demo').addEventListener('click',demoRoll);$('#roll-export').addEventListener('click',exportRollMidi);
 $('#roll-clear').addEventListener('click',()=>{stopRoll();rollState.notes=[];rollState.seconds=16;rollState.playhead=-2.8;renderRoll()});
 $('#roll-edit-toggle').addEventListener('click',()=>{const wrap=$('#roll-editor-wrap'),expanded=wrap.hidden;wrap.hidden=!expanded;$('#roll-edit-toggle').setAttribute('aria-expanded',String(expanded));$('#roll-edit-toggle').textContent=expanded?'✕ Tutup editor':'✎ Editor nada';});
 $('#fall-speed').addEventListener('change',e=>{const next=Number(e.target.value);if(!Number.isFinite(next)||next<=0)return;const wasPlaying=rollState.playing;if(wasPlaying)stopRoll();rollState.rate=next;if(wasPlaying)playRoll();});
 $('#fall-seek').addEventListener('input',e=>{stopRoll();rollState.playhead=Number(e.target.value);drawFallingRoll();});
 $('#roll-zoom').addEventListener('input',renderRoll);$('#roll-bpm').addEventListener('change',renderRoll);
 $('#roll-track').addEventListener('click',e=>{const n=e.target.closest('[data-roll-note]');if(n){rollState.notes.splice(Number(n.dataset.rollNote),1);renderRoll();return}
  const rect=$('#roll-track').getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;const midi=ROLL_HIGH-Math.floor(y/ROLL_H);if(midi<ROLL_LOW||midi>ROLL_HIGH)return;
  const start=Math.max(0,x/Number($('#roll-zoom').value));addRollNote(midi,start);playNote(midi)});
 $('#cheat-scale').addEventListener('click',e=>{const el=e.target.closest('[data-cheat-note]');if(el)playNote(Number(el.dataset.cheatNote))});
 $('#cheat-intervals').addEventListener('click',e=>{const el=e.target.closest('[data-cheat-note]');if(el){playNote(60+state.key);const n=Number(el.dataset.cheatNote);setTimeout(()=>playNote(n),260)}});
}

function wireEvents(){
 $$('.nav-link').forEach(b=>b.addEventListener('click',()=>switchPage(b.dataset.page)));
 $('#mobile-menu').addEventListener('click',()=>$('#sidebar').classList.toggle('is-open'));
 $('#chord-guide-toggle').addEventListener('click',()=>{chordGuideEnabled=!chordGuideEnabled;$('#chord-guide-toggle').textContent=chordGuideEnabled?'Sembunyikan panduan chord':'Lihat posisi chord';$('#chord-guide-toggle').setAttribute('aria-pressed',String(chordGuideEnabled));paintPiano();});
 $$('[data-piano-jump]').forEach(b=>b.addEventListener('click',()=>jumpToPiano(b.dataset.pianoJump,'main')));
 $$('[data-fall-jump]').forEach(b=>b.addEventListener('click',()=>jumpToPiano(b.dataset.fallJump,'fall')));
 $('#keys-label-toggle').addEventListener('click',()=>{const on=$('#piano').classList.toggle('show-all-notes');$('#keys-label-toggle').setAttribute('aria-pressed',String(on));$('#keys-label-toggle').textContent=on?'Sembunyikan nama nada':'Tampilkan semua nada'});
 $('#quick-start').addEventListener('click',()=>{state.style='major';switchPage('paths');setPreset('1452')});
 $('#help-button').addEventListener('click',()=>$('#help-dialog').showModal());$('#close-help').addEventListener('click',()=>$('#help-dialog').close());$('#help-done').addEventListener('click',()=>$('#help-dialog').close());
 $('#global-key').addEventListener('change',e=>changeKey(Number(e.target.value)));
 $('#global-scale').addEventListener('change',e=>changeKey(state.key,e.target.value));
 $('#transpose-down').addEventListener('click',()=>{state.transpose=Math.max(-11,state.transpose-1);renderStudio()});
 $('#transpose-up').addEventListener('click',()=>{state.transpose=Math.min(11,state.transpose+1);renderStudio()});
 $('#audio-test').addEventListener('click',()=>{if(!state.sound){state.sound=true;$('#sound-toggle').setAttribute('aria-pressed','true');$('#sound-label').textContent='Suara aktif';}playNote(60);toast('Memainkan Do tengah (C4).');});
 $('#sound-toggle').addEventListener('click',()=>{state.sound=!state.sound;$('#sound-toggle').setAttribute('aria-pressed',String(state.sound));$('#sound-label').textContent=state.sound?'Suara aktif':'Suara mati';if(state.sound){audioContext();loadPianoBank();playChord()}else toast('Audio dimatikan')});
 $('#root-note').addEventListener('change',e=>{state.root=Number(e.target.value);renderStudio();renderLearning()});
 $('#chord-quality').addEventListener('change',e=>{state.quality=e.target.value;renderStudio();renderLearning()});
 $('#bass-note').addEventListener('change',e=>{state.bass=Number(e.target.value);renderStudio();renderLearning()});
 $('#play-chord').addEventListener('click',()=>playChord());$('#add-current').addEventListener('click',()=>{state.progression.push(currentChord());switchPage('paths');toast('Chord masuk ke jalur. Pilih cabang berikutnya.')});
 $('#play-scale').addEventListener('click',()=>{let arr=scaleSteps().map(s=>60+mod(state.key+s));const ctx=audioContext();if(!ctx)return;arr.concat(arr.slice().reverse()).forEach((n,i)=>{tone(n+state.transpose,ctx.currentTime+i*.21+.04,.3,.24);setTimeout(()=>flashKey(n),i*210+30)})});
 $('#diatonic-list').addEventListener('click',e=>{const b=e.target.closest('[data-degree]');if(!b)return;const c=diatonicChordsForScale()[Number(b.dataset.degree)];state.root=c.root;state.quality=c.quality;state.bass=-1;$('#root-note').value=state.root;$('#chord-quality').value=state.quality;$('#bass-note').value=-1;renderStudio();renderLearning();playChord(c)});
 $('#fifths-svg').addEventListener('click',e=>{const el=e.target.closest('[data-wheel]');if(!el)return;const idx=Number(el.dataset.wheel),pc=FIFTHS[idx],inner=el.dataset.inner==='1';state.circleMode=inner?'minor':'major';changeKey(inner?pc+9:pc,inner?'minor':'major');playChord(chordObj(state.key,state.circleMode==='minor'?'m':'maj'))});
 $$('[data-circle-mode]').forEach(b=>b.addEventListener('click',()=>{const to=b.dataset.circleMode;if(to===state.circleMode)return;state.circleMode=to;changeKey(to==='minor'?state.key+9:state.key+3,to==='minor'?'minor':'major') }));
 $('#circle-family').addEventListener('click',e=>{const b=e.target.closest('[data-family]');if(!b)return;playChord(diatonicChord(Number(b.dataset.family)+1,state.circleMode))});
 $('#circle-to-path').addEventListener('click',()=>{state.style=state.circleMode;state.start=1;state.progression=[journeyRootChord(1)];switchPage('paths')});
 $('#circle-play').addEventListener('click',()=>playChord(chordObj(state.key,state.circleMode==='minor'?'m':'maj')));
 $('#journey-style').addEventListener('change',e=>{state.style=e.target.value;state.progression=state.progression.map(c=>c.degree?journeyRootChord(c.degree):c);renderJourney()});
 $('#journey-start').addEventListener('change',e=>{state.start=Number(e.target.value);state.progression=[journeyRootChord(state.start)];$$('.preset').forEach(b=>b.classList.remove('active'));renderJourney()});
 $('#presets').addEventListener('click',e=>{const b=e.target.closest('[data-preset]');if(b)setPreset(b.dataset.preset)});
 $('#clear-journey').addEventListener('click',()=>{state.progression=[];renderJourney()});
 $('#progression-track').addEventListener('click',e=>{const el=e.target.closest('[data-existing]');if(!el)return;const c=state.progression[Number(el.dataset.existing)];if(c)playChord(c)});
 $('#route-options').addEventListener('click',e=>{const b=e.target.closest('[data-add-route]');if(b)addSuggestion(Number(b.dataset.addRoute))});
 $('#route-svg').addEventListener('click',e=>{const b=e.target.closest('[data-route]');if(b)addSuggestion(Number(b.dataset.route))});
 $('#route-svg').addEventListener('keydown',e=>{const b=e.target.closest('[data-route]');if(b&&(e.key==='Enter'||e.key===' ')){e.preventDefault();addSuggestion(Number(b.dataset.route))}});
 $('#undo-journey').addEventListener('click',()=>{state.progression.pop();renderJourney()});
 $('#play-journey').addEventListener('click',playProgression);$('#export-midi').addEventListener('click',writeMidi);
 $('#bpm').addEventListener('input',e=>$('#bpm-value').textContent=e.target.value+' BPM');
 $('#surprise-me').addEventListener('click',()=>{const list=getSuggestions();const next=list[Math.floor(Math.random()*list.length)];state.progression.push(next.chord);renderJourney();playChord(next.chord);toast('Variasi baru: '+chordText(next.chord))});
 $$('[data-lesson]').forEach(b=>b.addEventListener('click',()=>{state.lesson=b.dataset.lesson;renderLearning()}));
 $('#note-picker').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.lessonNote){state.lessonNote=Number(b.dataset.lessonNote);renderLearning();playNote(state.lessonNote)}else if(b.id==='lesson-play-chord')playChord();else if(b.id==='lesson-go-studio')switchPage('studio');else if(b.dataset.beats)playRhythm(Number(b.dataset.beats))});
 $('#quiz-options').addEventListener('click',e=>{const b=e.target.closest('[data-answer]');if(b)checkAnswer(Number(b.dataset.answer))});
 $('#next-question').addEventListener('click',nextQuiz);
 // Only mapped keyboard shortcuts for piano; bypass inputs and modified shortcuts.
 const keyMap={a:60,w:61,s:62,e:63,d:64,f:65,t:66,g:67,y:68,h:69,u:70,j:71,k:72,o:73,l:74,p:75};
 document.addEventListener('keydown',e=>{if(e.ctrlKey||e.altKey||e.metaKey||e.repeat||['INPUT','SELECT','TEXTAREA'].includes(document.activeElement.tagName)||document.activeElement.closest('dialog[open]'))return;const midi=keyMap[e.key.toLowerCase()];if(midi!==undefined&&state.page==='studio'){activeKeys.add(midi);playNote(midi);}});
 document.addEventListener('keyup',e=>activeKeys.delete(keyMap[e.key.toLowerCase()]));
 document.addEventListener('pointerdown',e=>{if(window.innerWidth<670&&$('#sidebar').classList.contains('is-open')&&!$('#sidebar').contains(e.target)&&!$('#mobile-menu').contains(e.target))$('#sidebar').classList.remove('is-open')});
}
function init(){restoreLocal();initControls();createKeyboard();wireEvents();renderStudio();renderCircle();if(hadSavedJourney)renderJourney();else setPreset('1452');renderLearning();renderCheatSheet();initTranscription();sampleIndicator('Grand Piano · tekan tuts atau Tes suara');}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
