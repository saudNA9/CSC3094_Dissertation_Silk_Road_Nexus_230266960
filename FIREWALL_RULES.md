/*
 * FIREWALL_RULES.md
 * Documentation of implemented firewall rules and security measures.
 * Explains detected attack patterns, how they're prevented, and logging practices.
 */

# Firewall Rules and Attack Detection

## Overview

The Silk Road Nexus implements a multi-layer firewall to detect and prevent common web attacks. All detection occurs at the middleware layer, before requests reach application handlers.

## Detected Attacks

### 1. SQL Injection

**Description**: Attempt to manipulate database queries by injecting SQL commands into user input.

**Indicators Detected**:
- `UNION` - Used in UNION-based SQL injection
- `SELECT` - Direct query extraction
- `INSERT` - Data insertion attacks
- `DROP` - Database destruction attempts
- `ALTER` - Schema modification attempts
- `;` (semicolon) - Query termination and chaining
- `` ` `` (backtick) - Identifier escaping
- `'` (single quote) - String delimiter manipulation

**Example Blocked Request**:
```
/api/search?q='; DROP TABLE users; --
```

**Why Safe**: The backend uses SQLAlchemy ORM with parameterized queries. Even if SQL injection patterns slip past the firewall, the database layer protects against execution.

### 2. Cross-Site Scripting (XSS)

**Description**: Attempt to inject malicious JavaScript code that executes in other users' browsers.

**Indicators Detected** (both encoded and decoded):
- `<script>` - Script tag injection
- `<iframe>` - Frame injection for malicious content
- `%3Cscript%3E` - URL-encoded script tag
- `%3Ciframe%3E` - URL-encoded iframe tag

**Example Blocked Request**:
```
/entity/<img src=x onerror="alert('xss')">
/search?q=%3Cscript%3Ealert('XSS')%3C/script%3E
```

**Why Safe**: The frontend uses React's automatic HTML escaping. User-supplied data is never rendered as raw HTML.

### 3. Path Traversal

**Description**: Attempt to access files outside the intended directory using `../` sequences.

**Indicators Detected** (both encoded and decoded):
- `../` (dot dot forward slash) - Directory traversal
- `..` (dot dot) - Relative path reference
- `%2e%2e%2f` - URL-encoded traversal
- `%2e%2e/` - Mixed encoding
- `..%2f` - Mixed encoding variant

**Example Blocked Request**:
```
/api/file?path=../../../../etc/passwd
/download?file=../../secrets/.env
```

**Why Safe**: Next.js routes are file-based (not dynamic path segments). Files outside `/app` are inaccessible via routing.

## Logging

### Attack Detection Logging

Every detected attack is logged with:
- Attack type (sql_injection, xss, path_traversal)
- Request pathname
- Matched indicators
- Client IP address
- Timestamp (ISO format)

**Log Format**:
```
[Security] Attack detected:
- Type: sql_injection
- Pathname: /api/search
- Indicators: ['UNION', 'SELECT', ';']
- IP: 192.168.1.100
- Time: 2026-04-28T14:30:45.123Z
```

### Accessing Logs

**Local Development**: Check browser console or terminal where `npm run dev` is running.

**Production (Docker)**: 
```bash
docker logs silk-road-nexus  # Frontend logs
docker logs silk-road-api    # Backend logs (if needed)
```

## Response Behavior

### Attack Detected

1. Request is **blocked immediately**
2. User is **redirected** to `/attack-detected?attack=[type]`
3. Custom error page displays with:
   - Attack type and description
   - Explanation of what was blocked and why
   - Security notice about logging and potential IP blocking
   - Link back to home page
   - Link to architecture page (security documentation)
4. Incident is **logged** for security team review

### No Redirect Loop

The `/attack-detected` route itself is excluded from firewall scanning to prevent redirect loops.

## Implementation Details

### Middleware Configuration

File: `middleware.ts`

The firewall runs on all user-facing routes:
- ✓ Scans all page routes
- ✓ Scans API routes
- ✓ Excludes static assets (_next, images, favicon)
- ✓ Excludes error page (/attack-detected)

### Detection Library

File: `lib/firewall.ts`

**Key Functions**:
- `detectAttack(input)` - Scans a single string for attack indicators
- `scanRequest(pathname, params)` - Scans both pathname and query parameters
- `getAttackDescription(type)` - Returns human-readable attack description

**Performance**: Regex patterns are tested once per request; minimal overhead.

## Future Enhancements

### Missing from Current Implementation

Per requirements, the following are **intentionally excluded** to avoid false positives:
- `DELETE` - Legitimate delete() function calls needed
- `UPDATE` - Legitimate update() function calls needed

If you want to block these, move API routes to POST/PUT endpoints using a different pattern.

### Possible Additions

- LDAP injection detection
- Command injection detection
- Header injection detection
- Rate limiting per IP (for repeated attack attempts)
- Geographic IP blocking
- Machine learning anomaly detection

## Testing Attack Detection

### Test Locally

1. Start the dev server:
```bash
npm run dev
```

2. Try an attack in the URL bar:
```
http://localhost:3000/api/search?q='; DROP TABLE users; --
```

3. You should see:
   - Console warning: `[Security] Attack detected...`
   - Browser redirect to `/attack-detected?attack=sql_injection`
   - Beautiful error page with explanation

### Without Breaking Legitimate Requests

To test that legitimate requests pass through:
```
http://localhost:3000/graph?entity=Marco%20Polo&century=1200
```

Should work normally (no redirect, normal response).

## Database Layer Protection

Even if a request bypasses the firewall, the backend provides a second layer of defense:

**SQLAlchemy ORM** automatically:
- Uses prepared statements for all queries
- Escapes user input before database transmission
- Prevents raw SQL string concatenation

This is a **defense-in-depth** approach: firewall detects and blocks, ORM prevents exploitation.

## Compliance

This firewall implementation aligns with:
- **OWASP Top 10** - Addresses A03:2021 Injection
- **CWE-89** - SQL Injection
- **CWE-79** - Cross-site Scripting
- **CWE-22** - Path Traversal

## Questions?

For questions about specific attack patterns or edge cases, see:
- `lib/firewall.ts` - Detection logic with regex patterns
- `app/attack-detected/page.tsx` - User-facing error page
- `middleware.ts` - Middleware request scanning
