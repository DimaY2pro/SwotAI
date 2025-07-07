import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Footer, PageNumber } from "docx";
import { saveAs } from "file-saver";

const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const BRAND_COLORS = {
  NAVY: "183B68",
  AQUA: "7EC5B3",
  YELLOW: "F3B557",
  WHITE: "FFFFFF",
  BLACK: "000000",
  GRAY: "808080",
};

const BASE_FONT = "Calibri";

const createBullet = (text) => {
  return new Paragraph({
    text: text,
    bullet: {
      level: 0,
    },
    style: "Normal",
  });
};

export const generateDocx = (menteeName, careerGoal, responses) => {
  let lastExecutedStep = "DOCXExporter: Start of generateDocx";
  // console.log(lastExecutedStep); // Keep console logs for now, can be removed in final cleanup
  // console.log("DOCXExporter: Data received - Mentee Name:", menteeName, "Career Goal:", careerGoal);

  if (!menteeName || !careerGoal || !responses || Object.keys(responses).length === 0) {
    lastExecutedStep = "DOCXExporter: Aborted due to missing required data at function start.";
    console.error(lastExecutedStep); // Keep error logs
    alert(lastExecutedStep);
    return;
  }

  try {
    lastExecutedStep = "DOCXExporter: Step 1 - Attempting to initialize Document object...";
    // console.log(lastExecutedStep);
    const doc = new Document({
      creator: "AI SWOT Career Builder",
      title: "SWOT Analysis Report",
      description: `SWOT Analysis for ${menteeName}`,
      sections: [],
      styles: {
        paragraphStyles: [
          {
            id: "Normal",
            name: "Normal",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: BASE_FONT,
              size: 22, // 11pt
            },
            paragraph: {
              spacing: { after: 100 },
            }
          },
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: BASE_FONT,
              size: 40, // 20pt
              bold: true,
              color: BRAND_COLORS.NAVY,
            },
            paragraph: {
              spacing: {
                after: 360,
              },
            },
          },
          {
            id: "Heading2",
            name: "Heading 2",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: BASE_FONT,
              size: 32, // 16pt
              bold: true,
              color: BRAND_COLORS.NAVY,
            },
            paragraph: {
              spacing: {
                after: 120,
                before: 240,
              },
            },
          },
        ],
      },
    });

    const sectionsContent = [];
    lastExecutedStep = "DOCXExporter: Step 2 - Adding Title...";
    // console.log(lastExecutedStep);
    sectionsContent.push(
      new Paragraph({
        text: "SWOT Analysis Report",
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        style: "Heading1",
      })
    );

    lastExecutedStep = "DOCXExporter: Step 3 - Adding Mentee Name...";
    // console.log(lastExecutedStep);
    sectionsContent.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Name: ", bold: true, size: 22, font: BASE_FONT }),
          new TextRun({ text: String(menteeName || "N/A"), size: 22, font: BASE_FONT }),
        ],
        spacing: { after: 120 },
      })
    );

    lastExecutedStep = "DOCXExporter: Step 4 - Adding Career Goal...";
    // console.log(lastExecutedStep);
    sectionsContent.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Career Goal: ", bold: true, size: 22, font: BASE_FONT }),
          new TextRun({ text: String(careerGoal || "N/A"), size: 22, font: BASE_FONT }),
        ],
        spacing: { after: 240 },
      })
    );

    lastExecutedStep = "DOCXExporter: Step 5 - Starting to add SWOT Sections...";
    // console.log(lastExecutedStep);
    for (const [sectionType, answers] of Object.entries(responses)) {
      lastExecutedStep = `DOCXExporter: Step 5a - Processing section: ${sectionType}`;
      // console.log(lastExecutedStep);
      if (answers && Array.isArray(answers) && answers.length > 0) {
        sectionsContent.push(
          new Paragraph({
            text: sectionType.charAt(0).toUpperCase() + sectionType.slice(1),
            heading: HeadingLevel.HEADING_2,
            style: "Heading2",
            spacing: { before: 240, after: 120 },
          })
        );
        answers.forEach((answer, index) => {
          lastExecutedStep = `DOCXExporter: Step 5b - Adding answer ${index + 1} for ${sectionType}`;
          // console.log(lastExecutedStep);
          const currentAnswer = (answer && String(answer).trim() !== "") ? String(answer) : "N/A";
          sectionsContent.push(createBullet(currentAnswer));
        });
      } else {
        lastExecutedStep = `DOCXExporter: Step 5d - Skipping empty/invalid section: ${sectionType}`;
        // console.log(lastExecutedStep);
      }
    }

    lastExecutedStep = "DOCXExporter: Step 6 - Adding content to the document section...";
    // console.log(lastExecutedStep);
    doc.addSection({
      properties: {},
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({
                  text: "YouthToPro | Empowering Arab Youth",
                  font: BASE_FONT,
                  size: 18, // 9pt
                  color: BRAND_COLORS.GRAY,
                }),
              ],
            }),
            new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                    new TextRun({
                        children: ["Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES],
                        font: BASE_FONT,
                        size: 18, // 9pt
                        color: BRAND_COLORS.GRAY,
                    }),
                ],
            }),
          ],
        }),
      },
      children: sectionsContent,
    });

    lastExecutedStep = "DOCXExporter: Step 7 - Attempting Packer.toBlob()...";
    // console.log(lastExecutedStep);
    Packer.toBlob(doc).then((blob) => {
      lastExecutedStep = "DOCXExporter: Step 8 - Blob created successfully. Attempting saveAs()...";
      // console.log(lastExecutedStep, "Size:", blob.size);
      const formattedDate = getFormattedDate();
      const safeMenteeName = (menteeName || "User").replace(/[^a-zA-Z0-9]/g, "_");
      saveAs(blob, `DLV04 SWOT ${safeMenteeName}_${formattedDate}.docx`);
      lastExecutedStep = "DOCXExporter: Step 9 - saveAs() called.";
      // console.log(lastExecutedStep);
    }).catch((packerError) => {
      lastExecutedStep = "DOCXExporter: Error during Packer.toBlob() or saveAs()";
      console.error(lastExecutedStep, packerError);
      let alertMessage = `Error preparing/saving DOCX (Packer/SaveAs).\nLast step: ${lastExecutedStep}\n`;
      if (packerError && packerError.message) {
        alertMessage += `Error: ${packerError.message}`;
      } else {
        alertMessage += "Unknown error during packing/saving.";
      }
      alert(alertMessage);
    });

  } catch (docCreationError) {
    console.error(`DOCXExporter: CRITICAL ERROR at step: ${lastExecutedStep}`, docCreationError);
    let errorDetails = `Error initializing DOCX document AT: ${lastExecutedStep}.`;
    if (docCreationError) {
      errorDetails += `\nType: ${docCreationError.name || 'Unknown Type'}`;
      if (docCreationError.message) {
        errorDetails += `\nMessage: ${docCreationError.message}`;
      } else {
        errorDetails += `\nMessage: Not available`;
      }
      if (docCreationError.stack) {
        console.error("DOCXExporter: Stack trace:", docCreationError.stack);
        errorDetails += `\n(Full stack trace logged to console if available)`;
      } else {
        errorDetails += `\n(Stack trace not available)`;
      }
    }
    alert(errorDetails);
    try {
        console.log("DOCXExporter: docCreationError object (stringified with own properties):", JSON.stringify(docCreationError, Object.getOwnPropertyNames(docCreationError)));
    } catch (e) {
        console.log("DOCXExporter: Could not stringify docCreationError with getOwnPropertyNames.");
    }
  }
};
