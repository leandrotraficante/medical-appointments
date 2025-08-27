import { 
  authenticateToken, 
  requireRole
} from '../../../src/middleware/auth.middleware.js';

describe('Auth Middleware Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    // Setup básico
    mockReq = {
      headers: {},
      user: null
    };
    mockRes = {
      status: function(code) { 
        this.statusCode = code; 
        return this; 
      },
      json: function(data) { 
        this.responseData = data; 
        return this; 
      }
    };
    mockNext = function() {};
  });

  describe('authenticateToken', () => {
    test('debería fallar sin header de autorización', async () => {
      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.statusCode).toBe(401);
      expect(mockRes.responseData.error).toBe('Authentication token is required. Please log in to continue');
    });

    test('debería fallar con header de autorización vacío', async () => {
      mockReq.headers.authorization = 'Bearer ';

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.statusCode).toBe(401);
      expect(mockRes.responseData.error).toBe('Authentication token is required. Please log in to continue');
    });
  });

  describe('requireRole', () => {
    test('debería fallar sin usuario autenticado', () => {
      requireRole(['doctor'])(mockReq, mockRes, mockNext);

      expect(mockRes.statusCode).toBe(401);
      expect(mockRes.responseData.error).toBe('Authentication required. Please log in to continue');
    });

    test('debería fallar con rol no permitido', () => {
      mockReq.user = { id: '123', role: 'patient' };

      requireRole(['doctor', 'admin'])(mockReq, mockRes, mockNext);

      expect(mockRes.statusCode).toBe(403);
      expect(mockRes.responseData.error).toBe('You do not have permission to access this resource');
    });

    test('debería manejar array de roles con un solo elemento', () => {
      mockReq.user = { id: '123', role: 'doctor' };

      requireRole(['doctor'])(mockReq, mockRes, mockNext);

      // Debería llamar a next() sin error
      expect(mockRes.statusCode).toBeUndefined();
    });

    test('debería manejar array de roles con múltiples elementos', () => {
      mockReq.user = { id: '123', role: 'patient' };

      requireRole(['doctor', 'patient', 'admin'])(mockReq, mockRes, mockNext);

      // Debería llamar a next() sin error
      expect(mockRes.statusCode).toBeUndefined();
    });
  });
});
