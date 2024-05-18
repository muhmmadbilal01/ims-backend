import http from "http";

const sendEmail = (email, message) => {
    const data = JSON.stringify({
        service_id: 'service_zq3r4ir',
        template_id: 'your_template_id',
        user_id: 'your_user_id',
        template_params: {
            to_email: email,
            subject: "Reset Password OTP",
            message: message
        }
    });

    const options = {
        hostname: 'api.emailjs.com',
        path: '/api/v1.0/email/send',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const request = http.request(options, (response) => {
        let responseData = '';

        response.on('data', (chunk) => {
            responseData += chunk;
        });

        response.on('end', () => {
            console.log(responseData);
        });
    });

    request.on('error', (error) => {
        console.error(error);
    });

    request.write(data);
    request.end();
};

sendEmail('recipient@example.com', 'This is a test email from EmailJS.');
