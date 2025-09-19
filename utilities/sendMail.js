const nodemailer = require("nodemailer");

exports.sendMail = async function (options) {
	const transporter = nodemailer.createTransport({
		host: "sandbox.smtp.mailtrap.io",
		port: "2525",
		auth: {
			user: "77b56535faebe7",
			pass: "003939de5561a6",
		},
	});

	const mailOptions = {
		from: "noreply@jashn.in",
		to: options.email,
		subject: options.subject,
		html: options.html,
	};

	await transporter.sendMail(mailOptions);
};
