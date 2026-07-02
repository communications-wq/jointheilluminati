from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import smtplib
from email.message import EmailMessage

load_dotenv()

DEST_EMAIL = os.getenv('DEST_EMAIL', '')
SMTP_HOST = os.getenv('SMTP_HOST')
SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
SMTP_USER = os.getenv('SMTP_USER')
SMTP_PASS = os.getenv('SMTP_PASS')
SMTP_SECURE = os.getenv('SMTP_SECURE', 'false').lower() == 'true'
PORT = int(os.getenv('PORT', '3000'))
FROM_EMAIL = os.getenv('FROM_EMAIL', SMTP_USER or 'no-reply@example.com')

app = Flask(__name__, static_folder='public', static_url_path='')


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    phone = (data.get('phone') or '').strip()
    invitation_code = (data.get('invitationCode') or '').strip()
    message_text = (data.get('message') or '').strip()

    if not name or not email or not phone or not invitation_code:
        return jsonify(ok=False, error='Name, email, phone and invitation code required'), 400

    to = DEST_EMAIL or os.getenv('FALLBACK_EMAIL') or 'no-reply@example.com'
    subject = f'Illuminati Membership Signup: {name}'
    body = f'New signup:\nName: {name}\nEmail: {email}\nPhone: {phone}\nInvitation Code: {invitation_code}\nMessage: {message_text}'
    confirmation_subject = 'Congratulations on your interest'
    confirmation_body = (
        f'Congratulations {name},\n\n'
        'Your interest in the Illuminati has been received. '
        'One of our representatives will get back to you if they deem you worthy.\n\n'
        f'Phone: {phone}\nEmail: {email}\nInvitation Code: {invitation_code}'
    )

    if SMTP_HOST and SMTP_USER:
        try:
            if SMTP_SECURE:
                server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT)
            else:
                server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
                server.ehlo()
                server.starttls()

            server.login(SMTP_USER, SMTP_PASS)

            msg = EmailMessage()
            msg.set_content(body)
            msg['Subject'] = subject
            msg['From'] = FROM_EMAIL
            msg['To'] = to
            msg['Reply-To'] = email
            server.send_message(msg)

            confirmation_msg = EmailMessage()
            confirmation_msg.set_content(confirmation_body)
            confirmation_msg['Subject'] = confirmation_subject
            confirmation_msg['From'] = FROM_EMAIL
            confirmation_msg['To'] = email
            confirmation_msg['Reply-To'] = to
            server.send_message(confirmation_msg)

            server.quit()
            return jsonify(ok=True)
        except Exception as e:
            return jsonify(ok=False, error=str(e)), 500
    else:
        print('No SMTP configured. Signup:', body)
        print('No SMTP configured. Confirmation:', confirmation_body)
        return jsonify(ok=True, preview='printed to server logs')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT)
