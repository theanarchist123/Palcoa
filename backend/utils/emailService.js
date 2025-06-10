const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '2023.nikhil.kadam@ves.ac.in',
        pass: 'fhwa hlep opqy dukz' // Replace with your actual App Password
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendBookingStatusEmail = async (userEmail, status, bookingDetails) => {
    const statusText = status === 'accepted' ? 'Accepted' : 'Declined';
    const statusColor = status === 'accepted' ? '#28a745' : '#dc3545';
    
    const emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #ff69b4, #ff1493); padding: 20px; border-radius: 10px 10px 0 0;">
                <h1 style="color: #fff; margin: 0; text-align: center;">Bayleaf Salon</h1>
            </div>
            <div style="background: #fff; padding: 20px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <h2 style="color: ${statusColor}; text-align: center;">Booking ${statusText}</h2>
                <div style="margin: 20px 0;">
                    <p><strong>Service:</strong> ${bookingDetails.service}</p>
                    <p><strong>Date:</strong> ${bookingDetails.date}</p>
                    <p><strong>Time:</strong> ${bookingDetails.time}</p>
                    <p><strong>Location:</strong> ${bookingDetails.location}</p>
                </div>
                ${status === 'accepted' ? `
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px;">
                        <p style="margin: 0;"><strong>Next Steps:</strong></p>
                        <p>Please arrive 10 minutes before your appointment time. If you need to reschedule, please contact us at least 24 hours in advance.</p>
                    </div>
                ` : `
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px;">
                        <p style="margin: 0;">We apologize for any inconvenience. Please feel free to book another appointment at your convenience.</p>
                    </div>
                `}
                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #666; font-size: 14px;">Thank you for choosing Bayleaf Salon</p>
                    <p style="color: #666; font-size: 14px;">
                        Contact us: bayleaf.salon.india@gmail.com<br>
                        Phone: 7021623887
                    </p>
                </div>
            </div>
        </div>
    `;

    const mailOptions = {
        from: {
            name: 'Bayleaf Salon',
            address: 'bayleaf.salon.india@gmail.com'
        },
        to: userEmail,
        subject: `Booking ${statusText} - Bayleaf Salon`,
        html: emailTemplate
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to send emails');
    }
});

module.exports = {
    sendBookingStatusEmail
};