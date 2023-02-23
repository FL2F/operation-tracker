const connectDB = require("../config/db");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const connection = connectDB();

//Description: Get All Emails
//Route: GET /api/emails
const getAll = (req, res) => {
  const getAllQuery = `
  SELECT * FROM fl2f_smf.emails`;

  connection.query(getAllQuery, (error, results) => {
    if (error) {
      console.log("Error selection from database: ", error);
      res.status(500).json({ error: "Error selection from database" });
      return;
    }
    res.status(200).json(results);
  });
};

//Description: Get specific email
//Route: GET /api/emails/:id
const getSpecificEmail = (req, res) => {
  const getAllQuery = `
  SELECT * FROM fl2f_smf.emails WHERE id = ?`;
  const value = req.params.id;

  connection.query(getAllQuery, value, (error, results) => {
    if (error) {
      console.log("Error selection from database: ", error);
      res.status(500).json({ error: "Error selection from database" });
      return;
    }
    res.status(200).json(results);
  });
};

//Description: Create Email
//Route: POST /api/emails
const createEmail = (req, res) => {
  const { id, email_title, subject, body } = req.body;

  if (!id || !email_title || !subject || !body) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  //Create email
  const insertQuery = `INSERT INTO fl2f_smf.emails (id, email_title, subject, body) VALUES (?, ?, ?, ?)`;
  const values = [id, email_title, subject, body];
  connection.query(insertQuery, values, (err, results) => {
    if (results.affectedRows > 0) {
      res.status(201).json("Email Successfully Created");
    } else {
      res.status(400);
      throw new Error("Invalid Email Data");
    }
  });
};

//Description: Update Specific email
//Route: PUT /api/emails/:id
const updateEmail = (req, res) => {
  const updateQuery = `
  UPDATE fl2f_smf.emails
  SET id = ?,
  email_title = ?,
  subject = ?,
  body = ?
  WHERE id = ?;
  `;

  const emailValues = [
    req.body.id,
    req.body.email_title,
    req.body.subject,
    req.body.body,
    req.body.id,
  ];

  connection.query(updateQuery, emailValues, (error, results) => {
    if (error) {
      console.log("Error inserting into database: ", error);
      res.status(500).json({ error: "Error inserting into database" });
      return;
    }
    res.status(200).json(results);
  });
};

//Description: Delete Specific email
//Route: DELETE /api/emails/:id
const deleteEmail = (req, res) => {
  const deleteQuery = `
    DELETE FROM fl2f_smf.emails 
    WHERE id = ?`;

  const value = req.params.id;

  connection.query(deleteQuery, value, (error, results) => {
    if (error) {
      console.log("Error deleting from database: ", error);
      res.status(500).json({ error: "Error deleting from database" });
      return;
    }
    res.status(200).json(results);
  });
};

//Description: Send Email Via Twilio SendGrid
//Route: POST /api/emails/send-email
const sendEmail = (req, res) => {
  const { templateId, recipientEmail, recipientName, cohortName } = req.body;

  // get email template from DB
  const getEmailTemplateQuery = `
    SELECT * FROM fl2f_smf.emails WHERE id = ?
  `;
  const value = [templateId];

  connection.query(getEmailTemplateQuery, value, (err, results) => {
    if (err || results.length === 0) {
      console.log("Error selecting from database: ", err);
      res
        .status(500)
        .json({ error: "Error selecting email template from database" });
      return;
    }
    // Replace placeholders in email template with recipient information
    const emailTemplate = results[0];
    const emailSubject = emailTemplate.subject.replace(
      "[cohortName]",
      cohortName
    );

    const linebreak = "<br/>";
    const emailBody = emailTemplate.body
      .replace("[recipientName]", recipientName)
      .replaceAll("[br]", linebreak);

    // Send email using Twilio SendGrid
    const msg = {
      to: recipientEmail,
      from: "robbie.prokop@fl2f.ca",
      subject: emailSubject,
      text: emailBody,
      html: emailBody,
    };

    // res.status(200).json(msg);
    sgMail
      .send(msg)
      .then(() => {
        console.log(`Email sent to ${recipientEmail}`);
        res.status(200).json({ message: `Email sent to ${recipientEmail}` });
      })
      .catch((error) => {
        console.log("Error sending email: ", error);
        res.status(500).json({ error: "Error sending email" });
      });
  });
};

module.exports = {
  getAll,
  getSpecificEmail,
  createEmail,
  updateEmail,
  deleteEmail,
  sendEmail,
};
