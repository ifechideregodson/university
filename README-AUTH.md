# Production authentication setup

The app now supports Retool-backed authentication while retaining the three demo accounts as a temporary development fallback.

1. Create `users` records through Retool, with a secure password hash handled by your approved hashing mechanism.
2. Add `login_user`, `register_user`, and `change_password` actions to the Retool Workflow.
3. Never put passwords, password hashes, `RETOOL_API_KEY`, or other secrets in `NEXT_PUBLIC_*` variables.
4. Disable/remove demo credentials before public launch.
5. Provision administrators through an existing admin workflow; do not allow public admin registration.
