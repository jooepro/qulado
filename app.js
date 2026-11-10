document.documentElement.classList.add("js");
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const priceText=new Intl.NumberFormat("en-US",{style:"currency",currency:CONFIG.currency,maximumFractionDigits:0}).format(CONFIG.price);
const statusText=CONFIG.available?"Available for acquisition":"Not currently available";
const listingReady=/^https?:\/\//i.test(CONFIG.marketplaceUrl)&&!/REPLACE/i.test(CONFIG.marketplaceUrl);
$$('[data-bind="price"]').forEach(e=>e.textContent=priceText);
$$('[data-bind="statusText"]').forEach(e=>e.textContent=statusText);
$$('[data-bind="emailLink"]').forEach(e=>{e.textContent=CONFIG.contactEmail;e.href="mailto:"+CONFIG.contactEmail});
$("#status-text").textContent=statusText;
if(!CONFIG.available)$("#status").classList.add("off");
$("#yr").textContent=new Date().getFullYear();

/* Acquire buttons: one config value drives every one of them */
$$("[data-acquire]").forEach(a=>{
  if(listingReady){a.href=CONFIG.marketplaceUrl;a.target="_blank";a.rel="noopener noreferrer";}
  else a.addEventListener("click",e=>{
    e.preventDefault();
    $$("[data-acq-note]").forEach(n=>n.textContent="The marketplace listing is not live yet. Please send an inquiry or offer below.");
    $("#offer").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"});
    setTimeout(()=>$("#name").focus({preventScroll:true}),500);
  });
});
/* Offer buttons */
$$("[data-offer]").forEach(a=>a.addEventListener("click",e=>{
  e.preventDefault();$("#offer").scrollIntoView({behavior:"smooth"});setTimeout(()=>$("#amount").focus({preventScroll:true}),500);
}));

/* Line icons for the "Why" cards */
const ICONS=["M5 9h14M5 15h14M10 4L8 20M16 4l-2 16","M4 12h2M8 8v8M12 5v14M16 8v8M20 12h-2","M12 3l9 9-9 9-9-9z","M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z","M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18","M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"];
$$("#why .card").forEach((c,i)=>c.insertAdjacentHTML("afterbegin",`<div class="ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="${ICONS[i]}"/></svg></div>`));
(function(){
  const pct=(v,m)=>Math.round(v/m*100);
  $("#ins-top").innerHTML=INSIGHTS.top.map(m=>`<div class="icard rv" style="--w:${pct(m.value,m.max)}%"><h3>${m.label}${m.badge?`<span class="badge">${m.badge}</span>`:""}</h3><p class="num">${m.value}<small>/${m.max}</small></p><div class="bar" role="img" aria-label="${m.label}: ${m.value} out of ${m.max}"><span class="fill"></span></div><p class="d">${m.desc}</p><span class="src">${m.tag}</span></div>`).join("");
  const s=INSIGHTS.saas;
  $("#ins-saas").innerHTML=`<div class="icard saas rv" style="--v:${pct(s.value,s.max)}"><div><div class="ringw"><svg class="ring" viewBox="0 0 120 120" role="img" aria-label="${s.label}: ${s.value} out of ${s.max}"><circle class="rt" cx="60" cy="60" r="52" pathLength="100"/><circle class="rp" cx="60" cy="60" r="52" pathLength="100"/></svg><div class="rn" aria-hidden="true"><span>${s.value}<small>/${s.max}</small></span></div></div></div><div><h3>${s.label}<span class="badge">${s.badge}</span></h3><div class="sub" style="margin-top:20px">${s.subs.map(x=>`<div class="r${x.value===null?" ns":""}" style="--w:${x.value===null?0:pct(x.value,x.max)}%"><div class="t"><span>${x.label}</span><span>${x.value===null?"Not scored":x.value+"/"+x.max}</span></div><div class="bar"><span class="fill"></span></div></div>`).join("")}</div><p class="d" style="margin-top:20px">${s.note}</p><span class="src">${s.tag}</span></div></div>`;
  $("#ins-fine").textContent="Scores come from third-party tools (Flowdiction and Spaceship) as of "+INSIGHTS.asOf+". They are automated, informational and not guarantees. They are not legal advice or a trademark clearance, and they make no claim about traffic, revenue, search ranking or demand.";
})();
/* Ticker */
const words=["Labs","Health","Studio","Capital","Logistics","Learning","Cloud","Foods","Energy","Games","Media","Home"];
const row=words.map(w=>`<span>Qulado <b>${w}</b></span>`).join("");
$("#track").innerHTML=row+row;

/* Scroll reveal */
if("IntersectionObserver" in window){
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.12});
  $$(".rv").forEach(e=>io.observe(e));
}else $$(".rv").forEach(e=>e.classList.add("in"));

/* Form: validates, then opens a prepared email. Nothing is sent from this page. */
const form=$("#form"),fs=$("#fstatus");
const useEndpoint=CONFIG.offerMethod==="endpoint"&&/^https:\/\//i.test(CONFIG.offerEndpoint);
if(useEndpoint)form.querySelector("button[type=submit]").textContent="Send inquiry";
async function sendEndpoint(d){
  const btn=form.querySelector("button[type=submit]");btn.disabled=true;fs.className="show";fs.textContent="Sending...";
  try{
    const r=await fetch(CONFIG.offerEndpoint,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({...d,domain:CONFIG.domain})});
    if(!r.ok)throw new Error(r.status);
    fs.textContent="Thank you. Your inquiry was delivered and the owner will reply by email.";form.reset();
  }catch(err){fs.textContent="Your inquiry could not be sent, so nothing was delivered. Please email "+CONFIG.contactEmail+" directly."}
  btn.disabled=false;
}
const pd=$("#privacy-dialog");
$("#open-privacy").addEventListener("click",()=>pd.showModal());
$("#close-privacy").addEventListener("click",()=>pd.close());
const rules={
  name:v=>v.trim().length>1,
  email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
  amount:v=>{v=v.replace(/[,\s$]/g,"");return v===""||(/^\d+(\.\d+)?$/.test(v)&&+v>0)},
  message:v=>v.trim().length>=10
};
const check=k=>{const f=form[k],ok=rules[k](f.value);f.closest(".f").classList.toggle("invalid",!ok);f.setAttribute("aria-invalid",!ok);return ok};
Object.keys(rules).forEach(k=>form[k].addEventListener("blur",()=>check(k)));
form.addEventListener("submit",e=>{
  e.preventDefault();
  const bad=Object.keys(rules).filter(k=>!check(k));
  if(bad.length){fs.className="show";fs.textContent="Please fix the highlighted fields and try again.";form[bad[0]].focus();return}
  const d=Object.fromEntries(new FormData(form));
  if(useEndpoint){sendEndpoint(d);return}
  const body=`Name: ${d.name}\nEmail: ${d.email}\nCompany: ${d.company||"-"}\nOffer (USD): ${d.amount||"-"}\n\n${d.message}`;
  const url=`mailto:${CONFIG.contactEmail}?subject=${encodeURIComponent("Inquiry about "+CONFIG.domain)}&body=${encodeURIComponent(body)}`;
  fs.className="show";
  fs.textContent="Your email app should now open with this inquiry ready. It has not been sent yet. Press send there to deliver it. If nothing opens, write to "+CONFIG.contactEmail+" directly.";
  location.href=url;
});
