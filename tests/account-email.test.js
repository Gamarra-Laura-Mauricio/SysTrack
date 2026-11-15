const { accountEmailBase } = require('../src/services/account-email');

describe('accountEmailBase', () => {
  test('genera prefijo de técnico y normaliza nombre', () => {
    expect(accountEmailBase('Mauricio Gamarra', 'TECHNICIAN')).toBe('tecmauricio');
  });
  test('genera prefijo de administrador', () => {
    expect(accountEmailBase('Mauricio Gamarra', 'ADMIN')).toBe('adminmauricio');
  });
  test('elimina tildes y caracteres especiales', () => {
    expect(accountEmailBase('Ángela Núñez', 'COORDINATOR')).toBe('coordangela');
  });
  test('rechaza roles no reconocidos', () => {
    expect(() => accountEmailBase('Mauricio', 'ROOT')).toThrow('Rol no válido');
  });
});
