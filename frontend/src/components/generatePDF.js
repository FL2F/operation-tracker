import jsPDF from "jspdf";
import logo from "../assets/FL2F-logo.png";
import sig from "../assets/signature.png";

//jspdf onclick function
const GeneratePDF = (member, date) => {
  let doc = new jsPDF("l", "px", "a4");

  //pdf content
  doc.addImage(logo, "PNG", 20, 15, 130, 45);

  doc.setFontSize(18);
  doc.text(525, 40, `${date}`);

  doc.setFontSize(40);
  doc.setFont("helvetica", "normal");
  const certificateText = "Certificate of Achievement";
  const certificateTextWidth =
    (doc.getStringUnitWidth(certificateText) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  const certificateX =
    (doc.internal.pageSize.getWidth() - certificateTextWidth) / 2;
  doc.text(certificateX, 100, certificateText);

  // center the "Granted to:" text horizontally
  doc.setFontSize(28);
  const grantedToText = "Granted to:";
  const grantedToTextWidth =
    (doc.getStringUnitWidth(grantedToText) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  const grantedToX =
    (doc.internal.pageSize.getWidth() - grantedToTextWidth) / 2;
  doc.text(grantedToX, 130, grantedToText);

  // center the member title text horizontally
  doc.setFont("times", "normal");
  doc.setFontSize(22);
  const memberTitleText = member.title;
  const memberTitleTextWidth =
    (doc.getStringUnitWidth(memberTitleText) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  const memberTitleX =
    (doc.internal.pageSize.getWidth() - memberTitleTextWidth) / 2;
  doc.text(memberTitleX, 180, memberTitleText);

  //line
  doc.setLineWidth(0.9);
  doc.line(135, 190, 500, 190);

  // center the bottom text horizontally
  doc.setFontSize(18);
  const bottomText1 =
    "for her successful attendance, active participation and completion of";
  const bottomText1Width =
    (doc.getStringUnitWidth(bottomText1) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  const bottomText1X =
    (doc.internal.pageSize.getWidth() - bottomText1Width) / 2;
  doc.text(bottomText1X, 215, bottomText1);

  doc.setFontSize(43);
  doc.setTextColor(160, 160, 160);
  doc.setFont("times", "italic");
  const bottomText2 = `From Lab 2 Fulfillment Training workshop`;
  const bottomText2Width =
    (doc.getStringUnitWidth(bottomText2) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  const bottomText2X =
    (doc.internal.pageSize.getWidth() - bottomText2Width) / 2;
  doc.text(bottomText2X, 285, bottomText2);

  //signature img
  const sigWidth = 160; // width of the signature image
  const sigHeight = 65; // height of the signature image
  const sigX = (doc.internal.pageSize.width - sigWidth) / 2; // calculate X position
  const sigY = 315; // fixed Y position
  doc.addImage(sig, "PNG", sigX, sigY, sigWidth, sigHeight);

  doc.setTextColor(0, 0, 0);

  //line
  doc.setLineWidth(0.9);
  doc.line(135, 380, 500, 380);

  doc.setFont("times", "normal");
  doc.setFontSize(18);
  doc.text(250, 400, "Dr. Orly Yadid-Pecht");
  doc.text(230, 415, "Technologies and Beyond, Inc.");

  doc.save(`FL2F-certificate-${member.title}.pdf`);
};

export default GeneratePDF;
