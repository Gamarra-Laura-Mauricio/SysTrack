function calculatePriority(impact, urgency) {
  if (impact === 'ALTO' && urgency === 'ALTA') return 'CRITICA';
  if (impact === 'ALTO' || urgency === 'ALTA') return 'ALTA';
  if (impact === 'MEDIO' || urgency === 'MEDIA') return 'MEDIA';
  return 'BAJA';
}
module.exports = { calculatePriority };
