/* Edit only this file to update price, contact details, marketplace link and scores. */
/* ============ CONFIG: edit values here only ============ */
const CONFIG = {
  domain: "Qulado.com",
  price: 5495,
  currency: "USD",
  available: true,
  contactEmail: "yousefshabank@gmail.com",   // used by "Make an Offer" and the form
  offerMethod: "mailto",                      // "mailto" (opens the visitor's email app) or "endpoint"
  offerEndpoint: "",                          // https URL of your form service; used only when offerMethod is "endpoint"
  // Replace this one value with the real Hostinger listing URL once it exists.
  marketplaceUrl: "https://REPLACE-WITH-HOSTINGER-LISTING-URL"
};
/* ======================================================= */

/* Domain insights: edit the values here only. Scores are third-party and shown as reported. */
const INSIGHTS={
  asOf:"November 2026",
  top:[
    {label:"UDRP defensibility",value:100,max:100,tag:"Algorithmic score · Flowdiction",desc:"Higher means the name is easier to defend against a cybersquatting claim."},
    {label:"Trademark risk",value:0,max:100,badge:"Low risk",tag:"Registry check · Flowdiction",desc:"No well-known mark collision found. Standard clearance is still recommended before launch."},
    {label:"TLD availability",value:506,max:506,tag:"Availability check · Spaceship",desc:"Reported available across all 506 extensions checked."}
  ],
  saas:{label:"SaaS-Ready Score",value:64,max:100,badge:"Provisional · name-based",tag:"Algorithmic score · Flowdiction",
    subs:[{label:"Naming & recall",value:34,max:35},{label:"Pronunciation",value:18,max:20},{label:"Product keyword fit",value:12,max:20},{label:"Technical history",value:null,max:25}],
    note:"The 25 technical history points are not awarded until technical evidence is available. This reflects naming potential, not certified launch readiness."}
};
