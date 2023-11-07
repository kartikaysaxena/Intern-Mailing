var nodemailer = require('nodemailer');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
var cron = require('node-cron');

const fs = require('fs');
const filePath = './content.txt';
const textData = fs.readFileSync(filePath, 'utf8')
console.log(process.env.USER)
console.log(process.env.PASS)
console.log(process.env.GSHEET_APPS_SCRIPT)
var transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  port: 465,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
});
async function main() {
  try {
    const data = await fetch(process.env.GSHEET_APPS_SCRIPT);
    const json = await data.json();
    console.log(json);

    const mailPromises = json.map(async item => {
      const mailOptions = {
        from: process.env.USER,
        to: item.email,
        subject: 'Requesting for Internship',
        text: textData,
        attachments: [
          {
            filename: 'Resume_Kartikay.pdf',
            path: './Resume_Kartikay.pdf'
          }
        ]
      };

      mailOptions.text = textData;
      console.log(item.email);
      console.log(item.isMale);

      if (item.isMale === 0) {
        mailOptions.text = `Dear Ma'am ${textData.split('$')[0] + item.company + textData.split('$')[1]}`;
      } else if (item.isMale === 1) {
        mailOptions.text = `Dear Sir ${textData.split('$')[0] + item.company + textData.split('$')[1]}`;
      }

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
      } catch (error) {
        console.error('Error sending email:', error);
      }
    });

    await Promise.all(mailPromises);

  
  } catch (error) {
    console.error('Error:', error);
  }
}

main();