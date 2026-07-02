# Illuminati Membership Signup (local)

Simple Node.js + Express app with a frontend signup form. Submissions are emailed to the address configured in `DEST_EMAIL` (or previewed via Ethereal if SMTP not configured).

Setup

1. Copy `.env.example` to `.env` and edit values.
2. Install dependencies:

```bash
npm install
```

3. Run the server:

```bash
npm start
```

4. Open http://localhost:3000 in your browser and click "Signup for Membership".

Environment variables (in `.env`):

- `PORT` (optional)
- `DEST_EMAIL` recipient address for signups
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE` (optional) — if not provided the app will use an Ethereal test account and log a preview URL.

Using GMX SMTP

If you want to send real emails via GMX, set the SMTP environment variables in `.env` before starting the app. Example:

```
SMTP_HOST=mail.gmx.net
SMTP_PORT=587
SMTP_USER=your-gmx-username@gmx.net
SMTP_PASS=your-gmx-password
SMTP_SECURE=false
DEST_EMAIL=recipient@example.com
```

Notes:
- GMX typically accepts STARTTLS on port 587 (`SMTP_SECURE=false`).
- If your provider requires SSL, use port 465 and `SMTP_SECURE=true`.
- Keep credentials secure and provide them during deployment; do not commit `.env` to version control.
# jointheilluminati
