import nodemailer from 'nodemailer'

export async function sendVerificationEmail(email: string, verificationCode: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })

  // const transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: 'GMAIL@gmail.com',
  //     pass: 'password'
  //   }
  // });

  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?code=${verificationCode}&email=${encodeURIComponent(email)}`

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your email address',
    text: `Please click on the following link to verify your email: ${verificationLink}`,
    html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
              <h2 style="text-align: center; color: #4CAF50;">Verify Your Email Address</h2>
              <p>Hi there,</p>
              <p>Thank you for signing up! Please click the button below to verify your email address:</p>
              <p style="text-align: center;">
                  <a href="${verificationLink}" 
                     style="display: inline-block; background-color: #4CAF50; color: white; text-decoration: none; 
                     padding: 10px 20px; border-radius: 5px; font-size: 16px;">
                     Verify Email Address
                  </a>
              </p>
              <p>If the button doesn't work, you can copy and paste the following URL into your browser:</p>
              <p style="background: #f9f9f9; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                  ${verificationLink}
              </p>
              <p>If you didn't request this, please ignore this message.</p>
              <p>Best regards,</p>
              <p>The Hit.in</p>
          </div>
      </body>
      </html>`,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    ...options,
  })
}



 