const nodemailer = require("nodemailer");

let testAccount;
let transporter;

// Asynchronously initialize the testing transporter
async function initTransporter() {
  if (!testAccount) {
    console.log("Generating Ethereal test email account...");
    testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("Test email transporter ready!");
  }
}

/**
 * Sends a resolution email to a student using a test preview
 * @param {string} studentEmail 
 * @param {string} studentName 
 * @param {string} complaintTitle 
 * @param {string} resolvedAt 
 */
const sendResolutionEmail = async (studentEmail, studentName, complaintTitle, resolvedAt) => {
  // Ensure transporter is ready
  await initTransporter();

  const mailOptions = {
    from: '"SmartFix Support (TEST)" <support@smartfix.local>',
    to: studentEmail,
    subject: "Complaint Resolved ✅",
    text: `Hello ${studentName},

Your complaint titled "${complaintTitle}" has been successfully resolved.

If the issue still persists, you can reopen the complaint or raise a new one.

Complaint Details:
- Title: ${complaintTitle}
- Status: Resolved
- Resolution Time: ${resolvedAt}

Thank you for your patience.

Regards,
SmartFix Support Team`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`\n========================================`);
    console.log(`✅ Email successfully sent to ${studentEmail}`);
    console.log(`👀 **CLICK HERE TO VIEW EMAIL PREVIEW:** ${nodemailer.getTestMessageUrl(info)}`);
    console.log(`========================================\n`);
  } catch (error) {
    console.error(`Error sending test email:`, error.message);
  }
};

module.exports = { sendResolutionEmail };

