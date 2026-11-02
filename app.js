/* Assignment 6: all case answers are selected from the rendered DOM with jQuery. */
const originalRooms = [
  { id:'balcony', name:'Balcony', floor:2, guests:[
    {name:'Aigerim',color:'green',time:'20:45',aitu:true,items:['cup','crumbs']},
    {name:'Aliya',color:'yellow',time:'21:15',aitu:false,items:['phone','cup']},
    {name:'Madina',color:'green',time:'22:10',aitu:false,items:['phone','bag','crumbs']},
    {name:'Ivan',color:'black',time:'20:10',aitu:true,items:['cup']}
  ]},
  { id:'hall', name:'Hall', floor:2, guests:[
    {name:'Arman',color:'yellow',time:'20:35',aitu:false,items:['bag','glasses']},
    {name:'Sophia',color:'purple',time:'21:20',aitu:true,items:['phone']},
    {name:'Dias',color:'green',time:'19:45',aitu:true,items:[]},
    {name:'Bekzat',color:'purple',time:'20:55',aitu:false,items:['bag','cup','crumbs']},
    {name:'Aruzhan',color:'blue',time:'21:50',aitu:true,items:['phone']},
    {name:'Saule',color:'green',time:'21:25',aitu:false,items:['glasses']}
  ]},
  { id:'kitchen', name:'Kitchen', floor:1, guests:[
    {name:'Nurlan',color:'red',time:'19:40',aitu:true,items:['phone','cup']},
    {name:'Emma',color:'black',time:'20:15',aitu:false,items:['bag']},
    {name:'Timur',color:'green',time:'21:05',aitu:true,items:['phone','bag','crumbs']},
    {name:'Sergey',color:'yellow',time:'20:50',aitu:false,items:[]},
    {name:'Yerlan',color:'red',time:'21:40',aitu:true,items:['glasses','phone']},
    {name:'Kamila',color:'green',time:'20:05',aitu:false,items:['cup']}
  ]},
  { id:'living', name:'Living room', floor:1, guests:[
    {name:'Daniel',color:'blue',time:'19:55',aitu:true,items:['glasses']},
    {name:'Zarina',color:'green',time:'21:10',aitu:false,items:['bag','phone','crumbs']},
    {name:'Natasha',color:'yellow',time:'20:30',aitu:true,items:['glasses']},
    {name:'Askar',color:'black',time:'21:00',aitu:true,items:['phone']},
    {name:'Inkar',color:'purple',time:'20:20',aitu:false,items:['bag']}
  ]}
];
let rooms = structuredClone(originalRooms);
const icons = {phone:'▯',glasses:'⌕',bag:'♧',cup:'♨',crumbs:'◢'};
const labels = {phone:'phone',glasses:'glasses',bag:'bag',cup:'cup',crumbs:'cake crumbs'};
const roomNames = Object.fromEntries(originalRooms.map(room=>[room.id,room.name]));
const cases = [
  ['Who is in the hall?','Who is in the hall?'],['Who wears yellow or purple?','Who wears yellow or purple?'],['Which AITU students are upstairs?','Which AITU students are upstairs?'],['Who has glasses or a bag?','Who has glasses or a bag?'],['Who came with nothing?','Who came with nothing?'],['Who has a phone but no bag?','Who has a phone but no bag?'],['Who arrived 20:30–21:00?','Who arrived 20:30–21:00?'],['After 21:00, not AITU','After 21:00 and not AITU'],['Who is next to Askar?','Who stands next to Askar?'],['Last in each room','Who stands last in each room?'],['Third in each room','Who stands third in each room?'],['After Timur','Who stands after Timur?'],['Before someone in black','Who stands before someone in black?'],['Aruzhan’s room','In which room is Aruzhan?'],['Rooms under 6 guests','Which rooms have fewer than 6 guests?'],['Cup, nobody with glasses','Cup but nobody wears glasses'],['First arrival in each room','Who came first to each room?'],['Miras joins the party','Miras joins between Askar and Inkar'],['Natasha goes home','Natasha says goodbye'],['Who took the cake?','Who took the cake?']
];
function guestMarkup(g){const classes=['guest',g.color,...g.items,...(g.aitu?['aitu']:[])].join(' ');return `<article class="${classes}" data-name="${g.name}" data-color="${g.color}" data-time="${g.time}" data-aitu="${g.aitu}" data-items="${g.items.join(',')}" tabindex="0" aria-label="${g.name}, arrived ${g.time}"><div class="avatar-wrap" style="--ring:var(--${g.color})"><img loading="lazy" src="https://api.dicebear.com/9.x/open-peeps/svg?seed=${encodeURIComponent(g.name)}" alt="${g.name}'s avatar">${g.aitu?'<span class="student-badge" title="AITU student">✦</span>':''}</div><span class="guest-name">${g.name}</span><time class="guest-time">${g.time}</time><span class="guest-items">${g.items.map(item=>`<span class="item-icon" title="${labels[item]}">${icons[item]}</span>`).join('')}</span></article>`}
function renderHouse(){rooms.forEach(room=>{const $floor=room.floor===2?$('#upperFloor'):$('#lowerFloor');let $box=$floor.find(`[data-room="${room.id}"]`);if(!$box.length){$box=$(`<section class="room" data-room="${room.id}"><header class="room-head"><span class="room-title">${room.name}</span><span class="room-tools"><span class="room-count"></span><button class="sort-button" data-sort="${room.id}">SORT BY TIME ↕</button></span></header><div class="guest-row"></div></section>`);$floor.append($box)}$box.find('.room-count').text(`${room.guests.length} GUEST${room.guests.length===1?'':'S'}`);$box.find('.guest-row').html(room.guests.length?room.guests.map(guestMarkup).join(''):'<div class="empty-note">ROOM EMPTY</div>')});$('.room').each(function(){const id=$(this).data('room');if(!rooms.some(r=>r.id===id))$(this).remove()})}
function find(selector){return $(selector)}
function byName(name){return `.guest[data-name="${name}"]`}
function setResult($found,roomMode=false){$('.guest').removeClass('spotlit');$('.room').removeClass('room-found');const $targets=$found; if(roomMode){$targets.addClass('room-found');$targets.each(function(){$(this).find('.guest').addClass('spotlit')});$('.room').not($targets).find('.guest').fadeTo(300,.2)}else{$('.guest').not($targets).fadeTo(300,.2);$targets.fadeTo(150,1).addClass('spotlit')}
 const names=roomMode?$targets.map((_,el)=>$(el).find('.room-title').text()).get():$targets.map((_,el)=>$(el).data('name')).get();const noun=roomMode?'room':'guest';$('#resultText').html(names.length?`<strong>${names.length} ${noun}${names.length===1?'':'s'} found</strong><span class="result-muted"> · ${names.join(', ')}</span>`:`<strong>No matches</strong><span class="result-muted"> · This clue found nobody.</span>`);$targets.each(function(i){const $el=$(this);const isRoom=roomMode;const $move=isRoom?$el.find('.guest'): $el;$move.stop(true,false).each(function(){const $g=$(this);const top=$g.position().top;$g.animate({top:top-8},120).animate({top:top},180)})});return $targets}
function selectCase(n){let $found=$();let roomMode=false;
 switch(n){
 case 1:$found=find('.room[data-room="hall"] .guest');break;
 case 2:$found=find('.guest.yellow, .guest.purple');break;
 case 3:$found=find('.room').filter((_,el)=>$(el).closest('#upperFloor').length).find('.guest.aitu');break;
 case 4:$found=find('.guest.glasses').add(find('.guest.bag'));break;
 case 5:$found=find('.guest').filter(function(){return !$(this).hasClass('phone')&&!$(this).hasClass('glasses')&&!$(this).hasClass('bag')&&!$(this).hasClass('cup')&&!$(this).hasClass('crumbs')});break;
 case 6:$found=find('.guest.phone').not('.guest.bag');break;
 case 7:$found=find('.guest').filter(function(){const t=$(this).data('time');return t>='20:30'&&t<='21:00'});break;
 case 8:$found=find('.guest').filter(function(){return $(this).data('time')>'21:00'&&!$(this).hasClass('aitu')});break;
 case 9:$found=find(byName('Askar')).prev('.guest').add(find(byName('Askar')).next('.guest'));break;
 case 10:roomMode=true;$found=find('.room').map((_,el)=>$(el).find('.guest:last-child').closest('.room')).get();$found=$($found);break;
 case 11:$found=find('.room').find('.guest:nth-child(3)');break;
 case 12:$found=find(byName('Timur')).next('.guest');break;
 case 13:$found=find('.guest.black').prev('.guest');break;
 case 14:roomMode=true;$found=find('.room').has(byName('Aruzhan'));break;
 case 15:roomMode=true;$found=find('.room').filter((_,el)=>$(el).find('.guest').length<6);break;
 case 16:roomMode=true;$found=find('.room:has(.guest.cup):not(:has(.guest.glasses))');break;
 case 17:$found=find('.guest').filter(function(){const $g=$(this),t=$g.data('time');return $g.closest('.room').find('.guest').not(this).filter((_,el)=>$(el).data('time')<t).length===0});break;
 case 18:{if(!find(byName('Miras')).length){const g={name:'Miras',color:'blue',time:'21:20',aitu:true,items:['phone']},living=rooms.find(r=>r.id==='living');g.originalIndex=living.guests.length;living.guests.splice(living.guests.findIndex(x=>x.name==='Askar')+1,0,g);const $m=$(guestMarkup(g)).hide();$m.insertAfter(find(byName('Askar'))).fadeIn(450);$(`.room[data-room="living"] .room-count`).text(`${living.guests.length} GUESTS`)} $found=find(byName('Miras'));break}
 case 19:{const $nat=find(byName('Natasha'));if($nat.length){$nat.stop(true,true).fadeOut(450,function(){$(this).remove();rooms.forEach(r=>r.guests=r.guests.filter(g=>g.name!=='Natasha'));renderHouse()})}$('#resultText').html('<strong>Natasha has left the party.</strong><span class="result-muted"> · Her card faded away.</span>');return $nat}
 case 20:$found=find('.room').filter((_,el)=>$(el).closest('#lowerFloor').length).find('.guest').filter(function(){const $g=$(this),t=$g.data('time');return t>'21:00'&&t<'21:30'&&$g.hasClass('crumbs')&&!$g.hasClass('cup')&&($g.prev('.guest.aitu').length>0||$g.next('.guest.aitu').length>0)});break;
 }
 return setResult($found,roomMode)
}
function openGuest($g){const name=$g.data('name'),roomId=$g.closest('.room').data('room'),g=rooms.flatMap(r=>r.guests).find(x=>x.name===name);if(!g)return;const $back=$('#guestModal'),$modal=$('.guest-modal'),rect=$g.find('.avatar-wrap')[0].getBoundingClientRect();$back.stop(true,true).removeClass('closing').addClass('open').attr('aria-hidden','false');$modal.css({'--origin-x':`${rect.left+rect.width/2-window.innerWidth/2+285}px`,'--origin-y':`${rect.top+rect.height/2-window.innerHeight/2}px`});$('.modal-photo-wrap').html(`<div class="avatar-wrap" style="--ring:var(--${g.color})"><img src="https://api.dicebear.com/9.x/open-peeps/svg?seed=${encodeURIComponent(g.name)}" alt=""></div>`);$('#modalName').text(g.name);$('.modal-room').text(`${roomNames[roomId]} · FLOOR ${rooms.find(r=>r.id===roomId).floor}`);const facts=[`Came at <b>${g.time}</b>`,g.aitu?'<b>AITU student</b>':'Not an AITU student',`Wears <b>${g.color}</b>`,`Has <b>${g.items.length?g.items.map(x=>labels[x]).join(' and '):'nothing'}</b>`];$('.modal-facts').html(facts.map(x=>`<div class="fact">${x}</div>`).join(''));$('.move-buttons').html(rooms.filter(r=>r.id!==roomId).map(r=>`<button class="move-button" data-destination="${r.id}">→ ${r.name}</button>`).join(''));$modal.css({transform:'scale(.15)',opacity:0}).stop(true).animate({dummy:1},{duration:1,step:()=>{}}).animate({opacity:1},{duration:180,step:function(now){$(this).css('transform',`scale(${.15+now*.85})`)}})}
function closeGuest(){const $back=$('#guestModal'),$modal=$('.guest-modal');if(!$back.hasClass('open'))return;$modal.stop(true).animate({opacity:0},{duration:140,step:function(now){$(this).css('transform',`scale(${.15+now*.85})`)} ,complete:function(){$back.removeClass('open closing').attr('aria-hidden','true');$(this).css({transform:'scale(.15)',opacity:0})}})}
function moveGuest(destination){const name=$('#modalName').text(),oldRoom=rooms.find(r=>r.guests.some(g=>g.name===name)),newRoom=rooms.find(r=>r.id===destination);if(!oldRoom||!newRoom)return;const $guest=find(byName(name)),$oldRow=$guest.closest('.guest-row'),$newRow=$(`.room[data-room="${destination}"] .guest-row`),start=$guest.offset(),$ghost=$guest.clone().addClass('is-moving').appendTo('body');$ghost.css({position:'absolute',left:start.left,top:start.top,width:$guest.outerWidth(),margin:0,pointerEvents:'none'});const $oldGap=$('<div class="guest-placeholder"></div>').css({width:$guest.outerWidth(),height:$guest.outerHeight(),flex:'0 0 auto'}).insertAfter($guest),$newGap=$('<div class="guest-placeholder"></div>').css({width:0,height:$guest.outerHeight(),flex:'0 0 auto'}).appendTo($newRow);const data=oldRoom.guests.splice(oldRoom.guests.findIndex(g=>g.name===name),1)[0];newRoom.guests.push(data);$guest.remove();$oldGap.stop(true).animate({width:0},{duration:320});const target=$newRow.offset();$newGap.stop(true).animate({width:$guest.outerWidth()},{duration:300});$ghost.animate({left:target.left+newRoom.guests.length*57,top:target.top+37},{duration:430,step:function(now,fx){if(fx.prop==='top')$(this).css('transform',`rotate(${(now-start.top)*.025}deg)`)},complete:function(){$(this).remove();$oldGap.remove();$newGap.remove();renderHouse();$('#resultText').text(`${name} moved to ${newRoom.name}. Run a case to check the updated party.`)}});closeGuest()}
$(function(){rooms.forEach(r=>r.guests.forEach((g,i)=>g.originalIndex=i));renderHouse();cases.forEach((c,i)=>{$(`<button class="case-button" data-case="${i+1}"><span class="case-no">${String(i+1).padStart(2,'0')}</span>${c[0]}</button>`).appendTo(i<10?'#cases-people':'#cases-clues')});$(document).on('click','.case-button',function(){const n=Number($(this).data('case'));$('.case-button').removeClass('active');$(this).addClass('active');$('.guest,.room').stop(true,false);renderHouse();selectCase(n)});$('#clearSpotlight').on('click',function(){$('.guest').stop(true,false).fadeTo(300,1).removeClass('spotlit');$('.room').removeClass('room-found');$('.case-button').removeClass('active');$('#resultText').text('Spotlight cleared. All guests are back in the room.')});$(document).on('click','.guest',function(){openGuest($(this))});$(document).on('keydown','.guest',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openGuest($(this))}});$('.modal-close').on('click',closeGuest);$('#guestModal').on('click',function(e){if(e.target===this)closeGuest()});$(document).on('keydown',function(e){if(e.key==='Escape')closeGuest()});$(document).on('click','.move-button',function(){moveGuest($(this).data('destination'))});$(document).on('click','.sort-button',function(){const id=$(this).data('sort'),room=rooms.find(r=>r.id===id),$row=$(`.room[data-room="${id}"] .guest-row`),wasSorted=$row.attr('data-sorted')==='true',before={};$row.children('.guest').each(function(){before[$(this).data('name')]=$(this).offset()});if(wasSorted){room.guests.sort((a,b)=>a.sortIndex-b.sortIndex)}else{room.guests.forEach((g,i)=>g.sortIndex=i);room.guests.sort((a,b)=>a.time.localeCompare(b.time))} $row.attr('data-sorted',String(!wasSorted));room.guests.forEach(g=>$row.append($row.children(`[data-name="${g.name}"]`)));$row.children('.guest').each(function(){const p=before[$(this).data('name')];if(!p)return;const now=$(this).offset(),dx=p.left-now.left,dy=p.top-now.top;$(this).css({position:'relative',left:dx,top:dy}).stop(true).animate({left:0,top:0},{duration:500})});$(this).text(wasSorted?'SORT BY TIME ↕':'RESTORE ORDER ↕')})});
