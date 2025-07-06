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
    const sectionData = [
      { title: "Strengths", color: brandColors.aqua, key: "strengths", x: 40, y: 150 },
      { title: "Weaknesses", color: brandColors.yellow, key: "weaknesses", x: 300, y: 150 },
      { title: "Opportunities", color: brandColors.navy, key: "opportunities", x: 40, y: 420 },
      { title: "Threats", color: "#999999", key: "threats", x: 300, y: 420 }
    ];

    sectionData.forEach(({ title, color, key, x, y }) => {
      // Section Header Background
      pdf.setFillColor(color);
      pdf.rect(x, y, 230, 24, "F");
      pdf.setFontSize(13);
      pdf.setTextColor("#FFFFFF");
      pdf.setFont("helvetica", "bold");
      pdf.text(title, x + 10, y + 16);

      // Section Content
      pdf.setFontSize(11);
      pdf.setTextColor("#000000");
      pdf.setFont("helvetica", "normal");

      let currentY = y + 40;

      responses[key].forEach((answer) => {
        const lines = pdf.splitTextToSize(`• ${answer}`, 210);
        if (currentY + lines.length * 14 > 760) {
          pdf.addPage();
          drawHeader(pdf, pageWidth, margin, brandColors.navy);
          currentY = 80;
        }
        pdf.text(lines, x + 10, currentY);
        currentY += lines.length * 16;
      });
    });

    // --- FOOTER ---
    drawFooter(pdf, pageWidth, brandColors.navy, "www.youthtoprofessionals.org");

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


