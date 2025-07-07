import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const PDFButton = ({ menteeName, careerGoal, responses }) => {
  const generatePDF = () => {
    const pdf = new jsPDF("p", "pt", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 40;

    const brandColors = {
      yellow: "#F3B557",
      aqua: "#7EC5B3",
      navy: "#183B68"
    };

    pdf.setFont("helvetica");

    pdf.setFillColor(brandColors.navy);
    pdf.rect(0, 0, pageWidth, 60, "F");
    pdf.setTextColor("#FFFFFF");
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("YouthToPro – SWOT Analysis Document", margin, 40);

    pdf.setFontSize(12);
    pdf.setTextColor("#000000");
    pdf.setFont("helvetica", "normal");
    pdf.text(`Name: ${menteeName || "N/A"}`, margin, 90); // Added fallback for name
    pdf.text(`Career Goal: ${careerGoal || "N/A"}`, margin, 110); // Added fallback for goal

    const pageContentWidth = pageWidth - 2 * margin;
    const columnWidth = (pageContentWidth - margin / 2) / 2;
    const columnGap = margin / 2;

    const sectionDetails = {
      strengths: { title: "Strengths", color: brandColors.aqua },
      weaknesses: { title: "Weaknesses", color: brandColors.yellow },
      opportunities: { title: "Opportunities", color: brandColors.navy },
      threats: { title: "Threats", color: "#999999" } // A neutral color for threats
    };

    let currentX = margin;
    let currentY = 150;
    let maxYThisRow = currentY;

    const lineHeight = 16;
    const headerHeight = 24;
    const contentPaddingTop = 16;
    const sectionPaddingBottom = 20;

    const checkAndAddPage = (neededHeight) => {
      if (currentY + neededHeight > pdf.internal.pageSize.getHeight() - margin - 40) {
        drawFooter(pdf, pageWidth, brandColors.navy, "www.youthtoprofessionals.org");
        pdf.addPage();
        drawHeader(pdf, pageWidth, margin, brandColors.navy);
        currentY = margin + 60;
        maxYThisRow = currentY;
        return true;
      }
      return false;
    };

    const drawSwotSection = (key, xPos, startY) => {
      const { title, color } = sectionDetails[key];
      let sectionContentY = startY;
      // let sectionHeight = 0; // sectionHeight was unused

      checkAndAddPage(headerHeight + contentPaddingTop + lineHeight);

      pdf.setFillColor(color);
      pdf.rect(xPos, sectionContentY, columnWidth, headerHeight, "F");
      pdf.setFontSize(13);
      pdf.setTextColor("#FFFFFF");
      pdf.setFont("helvetica", "bold");
      pdf.text(title, xPos + 10, sectionContentY + 16);
      sectionContentY += headerHeight + contentPaddingTop;
      // sectionHeight += headerHeight + contentPaddingTop; // Unused

      pdf.setFontSize(11);
      pdf.setTextColor("#000000");
      pdf.setFont("helvetica", "normal");

      const sectionResponses = responses[key];
      if (sectionResponses && Array.isArray(sectionResponses) && sectionResponses.length > 0) {
        sectionResponses.forEach((answer) => {
          const currentAnswer = (answer && String(answer).trim() !== "") ? String(answer) : "N/A";
          const lines = pdf.splitTextToSize(`• ${currentAnswer}`, columnWidth - 20);
          const textBlockHeight = lines.length * lineHeight;

          checkAndAddPage(textBlockHeight);

          pdf.text(lines, xPos + 10, sectionContentY);
          sectionContentY += textBlockHeight;
          // sectionHeight += textBlockHeight; // Unused
        });
      } else {
         const lines = pdf.splitTextToSize("• N/A", columnWidth - 20);
         const textBlockHeight = lines.length * lineHeight;
         checkAndAddPage(textBlockHeight);
         pdf.text(lines, xPos + 10, sectionContentY);
         sectionContentY += textBlockHeight;
         // sectionHeight += textBlockHeight; // Unused
      }

      // sectionHeight += sectionPaddingBottom; // Unused
      return sectionContentY + sectionPaddingBottom;
    };

    // Strengths and Weaknesses (Top Row)
    drawSwotSection("strengths", currentX, currentY); // yAfterStrengths not strictly needed if not comparing for maxYThisRow logic
    drawSwotSection("weaknesses", currentX + columnWidth + columnGap, currentY); // yAfterWeaknesses not strictly needed

    // Force page break for Opportunities and Threats
    if (pdf.internal.getCurrentPageInfo().pageNumber >= 1) { // Check if we are on page 1 or more
        drawFooter(pdf, pageWidth, brandColors.navy, "www.youthtoprofessionals.org");
    }
    pdf.addPage();
    drawHeader(pdf, pageWidth, margin, brandColors.navy);
    currentY = margin + 60;
    // maxYThisRow = currentY; // Reset for new page, though not used if sections don't dynamically adjust Y
    currentX = margin;

    // Opportunities and Threats (Now on a New Page)
    drawSwotSection("opportunities", currentX, currentY);
    drawSwotSection("threats", currentX + columnWidth + columnGap, currentY);
    // maxYThisRow = Math.max(yAfterOpportunities, yAfterThreats); // Not strictly needed

    // Ensure footer is drawn on the last page
    drawFooter(pdf, pageWidth, brandColors.navy, "www.youthtoprofessionals.org");


    const formattedDate = getFormattedDate();
    const safeMenteeName = (menteeName || "User").replace(/[^a-zA-Z0-9]/g, "_");
    pdf.save(`DLV04 SWOT ${safeMenteeName}_${formattedDate}.pdf`);
  };

  const drawFooter = (pdf, width, color, website) => {
    const pageCount = pdf.internal.getNumberOfPages();
    const currentPage = pdf.internal.getCurrentPageInfo().pageNumber;
    const pageText = `Page ${currentPage} of ${pageCount}`;

    const footerY = pdf.internal.pageSize.getHeight() - 40;
    pdf.setFillColor(color);
    pdf.rect(0, footerY, width, 40, "F");
    pdf.setTextColor("#FFFFFF");
    pdf.setFontSize(10);
    pdf.text("YouthToPro | Empowering Arab Youth", 40, footerY + 25); // Adjusted Y for better centering
    pdf.text(pageText, width - 40 - pdf.getStringUnitWidth(pageText) * 10, footerY + 25); // Right align page number
  };

  const drawHeader = (pdf, width, margin, color) => {
    pdf.setFillColor(color);
    pdf.rect(0, 0, width, 60, "F");
    pdf.setTextColor("#FFFFFF");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("YouthToPro – SWOT Analysis Document", margin, 40);
  };

  return (
    <button
      onClick={generatePDF}
      className="px-4 py-2 rounded text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 transition ease-in-out duration-150"
      title="Download SWOT Analysis as PDF"
    >
      Download PDF
    </button>
  );
};

export default PDFButton;
