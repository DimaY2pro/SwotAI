import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Optional: good for future table layouts

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

    // Custom font setup (using core fonts like Helvetica for simplicity)
    pdf.setFont("helvetica");

    // --- HEADER ---
    pdf.setFillColor(brandColors.navy);
    pdf.rect(0, 0, pageWidth, 60, "F"); // header banner
    pdf.setTextColor("#FFFFFF");
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("YouthToPro – SWOT Analysis Document", margin, 40);

    // --- Mentee Info ---
    pdf.setFontSize(12);
    pdf.setTextColor("#000000");
    pdf.setFont("helvetica", "normal");
    pdf.text(`Name: ${menteeName}`, margin, 90);
    pdf.text(`Career Goal: ${careerGoal}`, margin, 110);

    // --- SWOT Content ---
    const pageContentWidth = pageWidth - 2 * margin;
    const columnWidth = (pageContentWidth - margin / 2) / 2; // Usable width for one column, with a small gap
    const columnGap = margin / 2;

    const swotOrder = ["strengths", "weaknesses", "opportunities", "threats"];
    const sectionDetails = {
      strengths: { title: "Strengths", color: brandColors.aqua },
      weaknesses: { title: "Weaknesses", color: brandColors.yellow },
      opportunities: { title: "Opportunities", color: brandColors.navy },
      threats: { title: "Threats", color: "#999999" }
    };

    let currentX = margin;
    let currentY = 150; // Initial Y position for the first row of SWOTs
    let maxYThisRow = currentY; // Tracks the max Y reached by content in the current row of sections

    const lineHeight = 16; // Approximate height of one line of text
    const headerHeight = 24;
    const contentPaddingTop = 16; // Space between header and content text
    const sectionPaddingBottom = 20; // Space after a section's content

    const checkAndAddPage = (neededHeight) => {
      if (currentY + neededHeight > pdf.internal.pageSize.getHeight() - margin - 40) { // 40 for footer
        drawFooter(pdf, pageWidth, brandColors.navy, "www.youthtoprofessionals.org");
        pdf.addPage();
        drawHeader(pdf, pageWidth, margin, brandColors.navy);
        currentY = margin + 60; // Reset Y to top of new page (below header)
        maxYThisRow = currentY;
        return true; // Page was added
      }
      return false; // No page added
    };

    // Function to draw a single SWOT section
    const drawSwotSection = (key, xPos, startY) => {
      const { title, color } = sectionDetails[key];
      let sectionContentY = startY;
      let sectionHeight = 0;

      // Check for page break before drawing header
      checkAndAddPage(headerHeight + contentPaddingTop + lineHeight); // Min height for header + one line

      // Section Header
      pdf.setFillColor(color);
      pdf.rect(xPos, sectionContentY, columnWidth, headerHeight, "F");
      pdf.setFontSize(13);
      pdf.setTextColor("#FFFFFF");
      pdf.setFont("helvetica", "bold");
      pdf.text(title, xPos + 10, sectionContentY + 16);
      sectionContentY += headerHeight + contentPaddingTop;
      sectionHeight += headerHeight + contentPaddingTop;

      // Section Content
      pdf.setFontSize(11);
      pdf.setTextColor("#000000");
      pdf.setFont("helvetica", "normal");

      if (responses[key] && responses[key].length > 0) {
        responses[key].forEach((answer) => {
          const lines = pdf.splitTextToSize(`• ${answer}`, columnWidth - 20); // -20 for padding within column
          const textBlockHeight = lines.length * lineHeight;

          checkAndAddPage(textBlockHeight); // Check if this block fits

          pdf.text(lines, xPos + 10, sectionContentY);
          sectionContentY += textBlockHeight;
          sectionHeight += textBlockHeight;
        });
      } else {
         const lines = pdf.splitTextToSize("• N/A", columnWidth - 20);
         const textBlockHeight = lines.length * lineHeight;
         checkAndAddPage(textBlockHeight);
         pdf.text(lines, xPos + 10, sectionContentY);
         sectionContentY += textBlockHeight;
         sectionHeight += textBlockHeight;
      }

      sectionHeight += sectionPaddingBottom;
      return sectionContentY + sectionPaddingBottom; // Return the Y position after this section
    };

    // Strengths and Weaknesses (Top Row)
    let yAfterStrengths = drawSwotSection("strengths", currentX, currentY);
    let yAfterWeaknesses = drawSwotSection("weaknesses", currentX + columnWidth + columnGap, currentY);
    maxYThisRow = Math.max(yAfterStrengths, yAfterWeaknesses);

    // Opportunities and Threats (Bottom Row)
    currentY = maxYThisRow; // Start next row below the tallest of the previous row
    currentX = margin; // Reset X for the new row

    // Check for page break before starting the second row, if it's too close to footer
    checkAndAddPage(headerHeight + contentPaddingTop + lineHeight + sectionPaddingBottom);


    let yAfterOpportunities = drawSwotSection("opportunities", currentX, currentY);
    let yAfterThreats = drawSwotSection("threats", currentX + columnWidth + columnGap, currentY);
    maxYThisRow = Math.max(yAfterOpportunities, yAfterThreats);

    // --- FOOTER ---
    // Ensure footer is drawn on the last page if content didn't trigger a page break forcing it
    // This check is to prevent double footers if checkAndAddPage already added one
    if (pdf.internal.getNumberOfPages() === pdf.internal.getCurrentPageInfo().pageNumber) {
        drawFooter(pdf, pageWidth, brandColors.navy, "www.youthtoprofessionals.org");
    }

    // Save
    pdf.save(`${menteeName}_SWOT_Document.pdf`);
  };

  // Draws footer on each page
  const drawFooter = (pdf, width, color, website) => {
    const height = pdf.internal.pageSize.getHeight();
    pdf.setDrawColor(255, 255, 255);
    pdf.setFillColor(color);
    pdf.rect(0, height - 40, width, 40, "F");
    pdf.setTextColor("#FFFFFF");
    pdf.setFontSize(10);
    pdf.text("YouthToPro | Empowering Arab Youth", 40, height - 20);
    pdf.text(website, width - 200, height - 20);
  };

  // Optional: redraw header on page breaks
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
      className="bg-[#183B68] text-white px-4 py-2 rounded hover:bg-[#152840] mt-4"
    >
      Download PDF Summary
    </button>
  );
};

export default PDFButton;


