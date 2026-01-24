/**
 * Environment Variable Validation Utility
 * Ensures required environment variables are present at runtime
 */

export function validateEnvVars(): void {
  const requiredEnvVars = [
    'NEXT_PUBLIC_API_BASE_URL',
    'NEXT_PUBLIC_BETTER_AUTH_URL',
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    console.warn(
      `Warning: Missing required environment variables: ${missingEnvVars.join(', ')}\n` +
      'Please check your .env.local file.'
    );
  }
}

// Run validation when module is imported
validateEnvVars();