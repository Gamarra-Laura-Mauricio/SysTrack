const { calculatePriority } = require('../src/services/priority');
describe('calculatePriority', () => {
  test('impacto alto y urgencia alta producen prioridad crítica', () => expect(calculatePriority('ALTO','ALTA')).toBe('CRITICA'));
  test('un factor alto produce prioridad alta', () => expect(calculatePriority('ALTO','BAJA')).toBe('ALTA'));
  test('factores medios producen prioridad media', () => expect(calculatePriority('MEDIO','MEDIA')).toBe('MEDIA'));
  test('factores bajos producen prioridad baja', () => expect(calculatePriority('BAJO','BAJA')).toBe('BAJA'));
});
