/* Project / experience data taken from the client's brief (Round 1).
   Names and details are subject to the client's confirmation that they may be used publicly. */
(function(){
  var pin = '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';

  D10.consulting = [
    {n:'Punjabi By Nature', loc:'',                           type:'Operating experience',  blurb:'Restaurant operations, growth and multi-format development experience.'},
    {n:'The Masala Story',  loc:'',                           type:'Own brand · Cloud kitchen', blurb:'Own-brand and cloud-kitchen experience.'},
    {n:'Namaste India',     loc:'Kuala Lumpur, Malaysia',     type:'Consulting engagement', blurb:'Consulting engagement.'},
    {n:'Gol Chakkar Cafe',  loc:'Dubai',                      type:'Consulting engagement', blurb:'Consulting engagement.'},
    {n:'Bhaijaan',          loc:'Hicksville, New York',       type:'Consulting engagement', blurb:'Pre-opening and operational engagement.'},
    {n:'Foodscapes Consulting', loc:'',                       type:'Consulting projects',   blurb:'Consulting projects.'},
    {n:'Curry Fwd',         loc:'',                           type:'Collaboration',         blurb:'Collaboration engagement.'}
  ];
  D10.supplyDone = [
    {n:'Ishq',     loc:'Manhattan, New York',         blurb:'Selected supply and packaging project.'},
    {n:'Bhaijaan', loc:'Hicksville, New York',        blurb:'Selected supply and packaging project.'},
    {n:'Zamindar', loc:'Charlotte, North Carolina',   blurb:'Selected supply and packaging project.'}
  ];
  D10.ongoingProject = {n:'Shola', loc:'Austin, Texas',
    blurb:'We are collaborating with Chef Hari Nayak on supply and packaging requirements for his upcoming project in Austin.'};

  function showBlurb(p, kind){
    if(kind === 'supply') return false;
    if(kind === 'ongoing') return true;
    return p.blurb.replace(/\.$/,'').toLowerCase() !== (p.type || '').toLowerCase();
  }
  // full card (projects page)
  D10.expCard = function(p, kind){
    var tag = kind === 'supply' ? '<span class="tag green">Completed</span>' : kind === 'ongoing' ? '<span class="tag live">Ongoing Collaboration</span>' : '<span class="tag gold">' + p.type + '</span>';
    return '<div class="exp" data-kind="' + kind + '"><div class="mono">' + p.n.charAt(0) + '</div>' + tag +
      '<h3>' + p.n + '</h3>' + (p.loc ? '<div class="loc">' + pin + p.loc + '</div>' : '') +
      (showBlurb(p, kind) ? '<p>' + p.blurb + '</p>' : '') + '</div>';
  };
  // gold call-to-action card used to complete a grid row
  D10.ctaCard = function(title, link, href){
    return '<a class="exp cta-card" href="' + href + '"><span class="eyebrow">Double 10</span><h3>' + title + '</h3><span class="link-arrow">' + link + '</span></a>';
  };
  // compact row (home page)
  D10.expRow = function(p, label){
    return '<div class="exp"><div class="mono">' + p.n.charAt(0) + '</div><h3>' + p.n + '</h3>' +
      '<div class="meta">' + (label || p.type) + (p.loc ? ' · ' + p.loc : '') + '</div></div>';
  };
})();
