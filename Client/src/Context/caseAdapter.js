/**
 * This file serves as an adapter to handle case-sensitivity issues
 * between 'Client' and 'client' folder references 
 */

// Re-export the auth context to ensure consistent casing
export { useAuth, AuthProvider } from './AuthContext'; 