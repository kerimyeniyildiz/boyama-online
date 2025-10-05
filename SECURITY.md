# Security Policy

## 🔒 Security Features

This application implements the following security measures:

### Authentication & Authorization
- ✅ **bcrypt password hashing** - Passwords are never stored in plain text
- ✅ **JWT tokens** - Secure session management with expiration
- ✅ **Rate limiting** - Protection against brute force attacks (5 attempts per 15 minutes)
- ✅ **Secure cookies** - HttpOnly, Secure, SameSite cookies

### Input Validation & Sanitization
- ✅ **File upload validation** - Magic byte verification, size limits (3MB)
- ✅ **Path traversal protection** - Filename sanitization
- ✅ **CSRF protection** - Token-based CSRF prevention
- ✅ **SQL injection protection** - No database queries (file-based storage)

### Security Headers
- ✅ **Content-Security-Policy** - XSS protection
- ✅ **Strict-Transport-Security** - HTTPS enforcement
- ✅ **X-Frame-Options** - Clickjacking protection
- ✅ **X-Content-Type-Options** - MIME sniffing protection
- ✅ **Permissions-Policy** - Feature control

### Dependency Security
- ✅ **Regular updates** - Automated dependency updates
- ✅ **Vulnerability scanning** - GitHub Dependabot alerts
- ✅ **Audit checks** - npm audit in CI/CD pipeline

## 📋 Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **DO NOT** open a public GitHub issue
2. Email security concerns to: security@funcoloringpages.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and provide updates every 7 days until resolved.

## 🛡️ Security Best Practices for Deployment

### Environment Variables
```bash
# Generate secure secrets
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For CSRF_SECRET

# Hash admin password
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
```

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong, unique `JWT_SECRET` and `CSRF_SECRET`
- [ ] Use `ADMIN_PASSWORD_HASH` instead of plain password
- [ ] Set `NEXT_PUBLIC_SECURE_COOKIE=true`
- [ ] Enable HTTPS
- [ ] Configure firewall rules
- [ ] Set up monitoring (Sentry)
- [ ] Regular backups
- [ ] Keep dependencies updated

### File Upload Security
- Maximum file size: 3MB
- Allowed types: PNG, JPEG only
- Magic byte validation enabled
- Filename sanitization
- Authentication required

## 🔄 Security Updates

We regularly update dependencies and monitor for security advisories:
- Weekly automated dependency updates
- Monthly security audits
- Immediate patches for critical vulnerabilities

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)
- [Node.js Security Checklist](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
