import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

const sendResetPasswordEmail = async (email, pwdResetToken) => {
  try {
    const templatePath = path.join(
      process.cwd(),
      'src/utils/templates',
      'resetPassword.hbs'
    );
    const template = handlebars.compile(fs.readFileSync(templatePath, 'utf8'));

    const resetURL = `${process.env.ALLOWED_ORIGIN}/reset-password/${pwdResetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset password for SkillPilot',
      html: template({ resetURL }),
    };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    return {
      success: false,
      message: 'Error sending email',
      error: error.message,
    };
  }
};

export default sendResetPasswordEmail;
