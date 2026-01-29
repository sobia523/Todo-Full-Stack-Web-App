
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '@/lib/auth/hooks/useAuth';
import { useAuthStore } from '@/lib/auth/store/authStore';

// Mock the auth store
jest.mock('@/lib/auth/store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

describe('useAuth', () => {
  let mockSetUser: jest.Mock;
  let mockSetToken: jest.Mock;
  let mockClearAuth: jest.Mock;
  let mockUseAuthStore: jest.Mock;

  beforeEach(() => {
    mockSetUser = jest.fn();
    mockSetToken = jest.fn();
    mockClearAuth = jest.fn();
    mockUseAuthStore = useAuthStore as jest.Mock;

    mockUseAuthStore.mockReturnValue({
      user: null,
      token: null,
      setUser: mockSetUser,
      setToken: mockSetToken,
      clearAuth: mockClearAuth,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct initial auth state', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('should call setUser when login is called', () => {
    const { result } = renderHook(() => useAuth());
    const userData = { id: 1, username: 'testuser', email: 'test@example.com' };
    const tokenData = 'test-token';

    act(() => {
      result.current.login(userData, tokenData);
    });

    expect(mockSetUser).toHaveBeenCalledWith(userData);
    expect(mockSetToken).toHaveBeenCalledWith(tokenData);
  });

  it('should call clearAuth when logout is called', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(mockClearAuth).toHaveBeenCalled();
  });

  it('should return isAuthenticated as true when user and token are present', () => {
    mockUseAuthStore.mockReturnValue({
      user: { id: 1, username: 'testuser' },
      token: 'test-token',
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should return isAuthenticated as false when user or token is missing', () => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      token: 'test-token',
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);

    mockUseAuthStore.mockReturnValue({
      user: { id: 1, username: 'testuser' },
      token: null,
    });

    const { result: result2 } = renderHook(() => useAuth());
    expect(result2.current.isAuthenticated).toBe(false);
  });
});
