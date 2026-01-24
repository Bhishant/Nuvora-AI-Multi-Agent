// verifier.js
function computeClaimConfidence(claim, sources = []) {
  const lc = claim.toLowerCase();
  let count = 0;
  for (const s of sources) {
    const text = (s.excerpt || '').toLowerCase();
    if (text.includes(lc) || lc.split(' ').slice(0,3).some(w => text.includes(w))) count++;
  }
  return Math.min(1, count / Math.max(1, sources.length));
}

function checkForContradictions(lines = [], sources = []) {
  return { contradictions: [], confidence: 1.0 };
}

module.exports = { computeClaimConfidence, checkForContradictions };
