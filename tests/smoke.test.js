const request=require('supertest'); const app=require('../src/server');
describe('SysTrack API',()=>{test('health endpoint responds',async()=>{const r=await request(app).get('/api/health');expect([200,503]).toContain(r.status);expect(r.body).toHaveProperty('status')})});
