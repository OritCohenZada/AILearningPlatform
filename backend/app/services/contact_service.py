import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.schemas import ContactCreate
from fastapi import HTTPException
from app.core.config import settings

def handle_contact_request(contact_data: ContactCreate):
    """
    Handles the contact flow:
    1. Validate config
    2. Format Email
    3. Send via SMTP
    """
    
  
    sender_email = settings.mail_username
    sender_password = settings.mail_password
    admin_email = settings.admin_email
    smtp_server = settings.mail_server
    smtp_port = settings.mail_port
    if not sender_email or not sender_password:
        raise HTTPException(status_code=500, detail="Server email configuration is missing")

  
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = admin_email
    msg['Subject'] = f"New GenLearn Message from: {contact_data.name}"

    body = f"""
    You have received a new contact request:
    --------------------------------------
    Name: {contact_data.name}
    Email: {contact_data.email}
    
    Message:
    {contact_data.message}
    """
    msg.attach(MIMEText(body, 'plain'))

   
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls() 
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        
        return {"status": "success", "message": "Email sent successfully"}

    except Exception as e:
        print(f"Error sending email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email")