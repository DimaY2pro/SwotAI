import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";

// Helper function to create a bullet point paragraph
const createBullet = (text) => {
  return new Paragraph({
    text: text,
    bullet: {
      level: 0,
    },
    style: "Normal", // Ensure a base style is applied if needed
  });
};

export const generateDocx = (menteeName, careerGoal, responses) => {
  let lastExecutedStep = "DOCXExporter: Start of generateDocx";
  console.log(lastExecutedStep); // Still useful if console works for some things
  console.log("DOCXExporter: Data received - Mentee Name:", menteeName, "Career Goal:", careerGoal);

  if (!menteeName || !careerGoal || !responses || Object.keys(responses).length === 0) {
    lastExecutedStep = "DOCXExporter: Aborted due to missing required data at function start.";
    console.error(lastExecutedStep);
    alert(lastExecutedStep); // Alert with step info
    return;
  }

  try {
    lastExecutedStep = "DOCXExporter: Step 1 - Attempting to initialize Document object...";
    console.log(lastExecutedStep);
    const doc = new Document({
      creator: "AI SWOT Career Builder",
      title: "SWOT Analysis Report",
      description: `SWOT Analysis for ${menteeName}`,
      sections: [], // Initialize with an empty sections array
      styles: {
        paragraphStyles: [
          {
            id: "Normal",
            name: "Normal",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: "Calibri",
              size: 24, // 12pt * 2
            },
          },
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: "Calibri",
              size: 32, // 16pt * 2
              bold: true,
            },
            paragraph: {
              spacing: {
                after: 240, // 12pt * 20
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
              font: "Calibri",
              size: 28, // 14pt * 2
              bold: true,
            },
            paragraph: {
              spacing: {
                after: 120, // 6pt * 20
                before: 240, // 12pt * 20
              },
            },
          },
        ],
      },
    });

    const sections = [];
    lastExecutedStep = "DOCXExporter: Step 2 - Adding Title...";
    console.log(lastExecutedStep);
    sections.push(
      new Paragraph({
        text: "SWOT Analysis Report",
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        style: "Heading1",
      })
    );

    lastExecutedStep = "DOCXExporter: Step 3 - Adding Mentee Name...";
    console.log(lastExecutedStep);
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Name: ", bold: true, size: 24 }),
          new TextRun({ text: String(menteeName || "N/A"), size: 24 }), // Ensure string, provide fallback
        ],
        spacing: { after: 120 },
      })
    );

    lastExecutedStep = "DOCXExporter: Step 4 - Adding Career Goal...";
    console.log(lastExecutedStep);
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Career Goal: ", bold: true, size: 24 }),
          new TextRun({ text: String(careerGoal || "N/A"), size: 24 }), // Ensure string, provide fallback
        ],
        spacing: { after: 240 },
      })
    );

    lastExecutedStep = "DOCXExporter: Step 5 - Starting to add SWOT Sections...";
    console.log(lastExecutedStep);
    for (const [sectionType, answers] of Object.entries(responses)) {
      lastExecutedStep = `DOCXExporter: Step 5a - Processing section: ${sectionType}`;
      console.log(lastExecutedStep);
      if (answers && Array.isArray(answers) && answers.length > 0) {
        sections.push(
          new Paragraph({
            text: sectionType.charAt(0).toUpperCase() + sectionType.slice(1),
            heading: HeadingLevel.HEADING_2,
            style: "Heading2",
            spacing: { before: 240, after: 120 },
          })
        );
        answers.forEach((answer, index) => {
          lastExecutedStep = `DOCXExporter: Step 5b - Adding answer ${index + 1} for ${sectionType}`;
          console.log(lastExecutedStep);
          if (answer && String(answer).trim() !== "") {
            sections.push(createBullet(String(answer)));
          } else {
            lastExecutedStep = `DOCXExporter: Step 5c - Adding N/A for empty answer ${index + 1} for ${sectionType}`;
            console.log(lastExecutedStep);
            sections.push(createBullet("N/A"));
          }
        });
      } else {
        lastExecutedStep = `DOCXExporter: Step 5d - Skipping empty/invalid section: ${sectionType}`;
        console.log(lastExecutedStep);
      }
    }
  
    lastExecutedStep = "DOCXExporter: Step 6 - Adding all collected sections to the document...";
    console.log(lastExecutedStep);
    doc.addSection({
      properties: {},
      children: sections,
    });

    lastExecutedStep = "DOCXExporter: Step 7 - Attempting Packer.toBlob()...";
    console.log(lastExecutedStep);
    Packer.toBlob(doc).then((blob) => {
      lastExecutedStep = "DOCXExporter: Step 8 - Blob created successfully. Attempting saveAs()...";
      console.log(lastExecutedStep, "Size:", blob.size);
      saveAs(blob, `SWOT_Analysis_${String(menteeName || 'User').replace(/ /g, "_")}.docx`);
      lastExecutedStep = "DOCXExporter: Step 9 - saveAs() called.";
      console.log(lastExecutedStep);
    }).catch((packerError) => {
      lastExecutedStep = "DOCXExporter: Error during Packer.toBlob() or saveAs()";
      console.error(lastExecutedStep, packerError); // Log error to console
      let alertMessage = `Error preparing/saving DOCX (Packer/SaveAs).\nLast step: ${lastExecutedStep}\n`;
      if (packerError && packerError.message) {
        alertMessage += `Error: ${packerError.message}`;
      } else {
        alertMessage += "Unknown error during packing/saving.";
      }
      alert(alertMessage);
    });

  } catch (docCreationError) {
    // This catch block is for errors during document construction, before Packer.toBlob()
    console.error(`DOCXExporter: CRITICAL ERROR at step: ${lastExecutedStep}`, docCreationError); // Log error to console

    let errorDetails = `Error initializing DOCX document AT: ${lastExecutedStep}.`; // Made AT uppercase for emphasis
    if (docCreationError) {
      errorDetails += `\nType: ${docCreationError.name || 'Unknown Type'}`;
      if (docCreationError.message) {
        errorDetails += `\nMessage: ${docCreationError.message}`;
      } else {
        errorDetails += `\nMessage: Not available`;
      }
      // Avoid logging full stack to alert as it can be too long. Console is better.
      if (docCreationError.stack) {
        console.error("DOCXExporter: Stack trace:", docCreationError.stack); // Log stack to console
        errorDetails += `\n(Full stack trace logged to console if available)`;
      } else {
        errorDetails += `\n(Stack trace not available)`;
      }
    }
    alert(errorDetails);
    // Fallback console log for the error object itself, in case it has non-standard properties
    try {
        console.log("DOCXExporter: docCreationError object (stringified with own properties):", JSON.stringify(docCreationError, Object.getOwnPropertyNames(docCreationError)));
    } catch (e) {
        console.log("DOCXExporter: Could not stringify docCreationError with getOwnPropertyNames.");
    }
  }
};
