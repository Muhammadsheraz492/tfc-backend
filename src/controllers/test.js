import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import fs from 'fs';
import cors from 'cors'; // Correct import

const upload = multer({ dest: 'uploads/' });

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Use environment variables
        pass: process.env.EMAIL_PASS  // Use environment variables
    }
});

export const SendEmailPdf = async (req, res) => {
    try {
        // Validate request
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Invalid request data' });
        }

        const { advocate, location, score, htmlContent } = req.body;
        const pdfPath = req.file.path;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'tocybernatesolution@gmail.com',
            subject: 'Quiz Results',
            html: htmlContent,
            attachments: [
                {
                    path: pdfPath,
                    filename: 'results.pdf'
                }
            ]
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        // Clean up the file after sending the email
        fs.unlink(pdfPath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
        });

        console.log('Email sent successfully');
        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.log('Error in processing request:', error);

        // Clean up the file if an error occurred before the file was deleted
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Error deleting file after failure:', err);
                }
            });
        }

        res.status(500).json({ success: false, message: 'Failed to process request' });
    }
};
