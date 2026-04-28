/*
 * lib/firewall.ts
 * Detects and prevents common web attacks: SQL injection, XSS, and path traversal.
 * Returns attack type and indicators found for logging and user feedback.
 */

export type AttackType = 'sql_injection' | 'xss' | 'path_traversal' | null;

interface AttackDetection {
  isAttack: boolean;
  type: AttackType;
  indicators: string[];
}

// SQL Injection indicators
const SQL_INJECTION_PATTERNS = [
  /union/i,
  /select/i,
  /insert/i,
  /drop/i,
  /alter/i,
  /;/,
  /`/,
  /'/,
];

// XSS indicators (encoded and decoded)
const XSS_PATTERNS = [
  /<script/i,
  /<iframe/i,
  /%3Cscript/i,
  /%3Ciframe/i,
];

// Path traversal indicators (encoded and decoded)
const PATH_TRAVERSAL_PATTERNS = [
  /\.\.\//,
  /\.\./,
  /%2e%2e%2f/i,
  /%2e%2e\//i,
  /\.\.%2f/i,
];

/**
 * Scan a string for attack indicators
 * Returns the type of attack and matched indicators
 */
export function detectAttack(input: string): AttackDetection {
  if (!input) {
    return { isAttack: false, type: null, indicators: [] };
  }

  // Check for SQL injection
  const sqlIndicators = SQL_INJECTION_PATTERNS.filter(pattern =>
    pattern.test(input)
  ).map(p => p.source);

  if (sqlIndicators.length > 0) {
    return {
      isAttack: true,
      type: 'sql_injection',
      indicators: sqlIndicators,
    };
  }

  // Check for XSS
  const xssIndicators = XSS_PATTERNS.filter(pattern =>
    pattern.test(input)
  ).map(p => p.source);

  if (xssIndicators.length > 0) {
    return {
      isAttack: true,
      type: 'xss',
      indicators: xssIndicators,
    };
  }

  // Check for path traversal
  const pathIndicators = PATH_TRAVERSAL_PATTERNS.filter(pattern =>
    pattern.test(input)
  ).map(p => p.source);

  if (pathIndicators.length > 0) {
    return {
      isAttack: true,
      type: 'path_traversal',
      indicators: pathIndicators,
    };
  }

  return { isAttack: false, type: null, indicators: [] };
}

/**
 * Scan both path and query parameters for attacks
 */
export function scanRequest(
  pathname: string,
  searchParams: Record<string, string | string[]>
): AttackDetection {
  // Scan pathname
  const pathnameDetection = detectAttack(pathname);
  if (pathnameDetection.isAttack) {
    return pathnameDetection;
  }

  // Scan query parameters
  for (const [key, value] of Object.entries(searchParams)) {
    const paramValue = Array.isArray(value) ? value.join('') : value;

    // Scan both key and value
    const keyDetection = detectAttack(key);
    if (keyDetection.isAttack) {
      return keyDetection;
    }

    const valueDetection = detectAttack(paramValue);
    if (valueDetection.isAttack) {
      return valueDetection;
    }
  }

  return { isAttack: false, type: null, indicators: [] };
}

/**
 * Get human-readable attack type description
 */
export function getAttackDescription(type: AttackType): string {
  const descriptions: Record<Exclude<AttackType, null>, string> = {
    sql_injection: 'SQL Injection Attempt',
    xss: 'Cross-Site Scripting (XSS) Attempt',
    path_traversal: 'Path Traversal Attempt',
  };

  return descriptions[type || 'sql_injection'] || 'Unknown Attack';
}
