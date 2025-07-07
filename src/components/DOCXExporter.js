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
  console.log("DOCXExporter: generateDocx called.");
  console.log("DOCXExporter: menteeName:", menteeName);
  console.log("DOCXExporter: careerGoal:", careerGoal);
  console.log("DOCXExporter: responses:", responses);

  if (!menteeName || !careerGoal || !responses || Object.keys(responses).length === 0) {
    console.error("DOCXExporter: Aborting - missing required data.");
    // This check is mostly defensive, primary validation should be in DOCXButton
    return;
  }

  try {
    console.log("DOCXExporter: Creating Document object...");
    const doc = new Document({
      creator: "AI SWOT Career Builder",
      title: "SWOT Analysis Report",
    description: `SWOT Analysis for ${menteeName}`,
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

  // Title
  sections.push(
    new Paragraph({
      text: "SWOT Analysis Report",
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      style: "Heading1", // Apply custom style if defined, or use direct formatting
    })
  );

  // Mentee Name
  sections.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Name: ", bold: true, size: 24 }),
        new TextRun({ text: menteeName, size: 24 }),
      ],
      spacing: { after: 120 },
    })
  );

  // Career Goal
  sections.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Career Goal: ", bold: true, size: 24 }),
        new TextRun({ text: careerGoal, size: 24 }),
      ],
      spacing: { after: 240 },
    })
  );

  // SWOT Sections
  for (const [sectionType, answers] of Object.entries(responses)) {
    if (answers && answers.length > 0) {
      sections.push(
        new Paragraph({
          text: sectionType.charAt(0).toUpperCase() + sectionType.slice(1),
          heading: HeadingLevel.HEADING_2,
          style: "Heading2", // Apply custom style
          spacing: { before: 240, after: 120 },
        })
      );
      answers.forEach((answer) => {
        if (answer.trim() !== "") {
          sections.push(createBullet(answer));
        }
      });
    }
  }

  // Add all sections to the document
  doc.addSection({
    properties: {},
    children: sections,
  });

  // Pack and save
    console.log("DOCXExporter: Attempting Packer.toBlob()...");
    Packer.toBlob(doc).then((blob) => {
      console.log("DOCXExporter: Blob created successfully. Size:", blob.size);
      console.log("DOCXExporter: Attempting saveAs()...");
      saveAs(blob, `SWOT_Analysis_${menteeName.replace(/ /g, "_")}.docx`);
      console.log("DOCXExporter: saveAs() called. Document download should have been triggered.");
    }).catch((packerError) => {
      console.error("DOCXExporter: Error during Packer.toBlob(): ", packerError);
      alert("Error preparing DOCX file content. Please check the console for details.");
    });
  } catch (docCreationError) {
    console.error("DOCXExporter: Error creating Document object or adding sections: ", docCreationError);
    alert("Error initializing DOCX document. Please check the console for details.");
  }
};
