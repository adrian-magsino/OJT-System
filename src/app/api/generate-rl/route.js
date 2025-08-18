import puppeteer from "puppeteer";
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { submissions } = await req.json();

    if (!submissions || !Array.isArray(submissions) || submissions.length === 0) {
      return new Response(
        JSON.stringify({ error: "No submissions provided" }), 
        { status: 400 }
      );
    }

    console.log(`Generating RL PDF for ${submissions.length} submission(s)`);

    // Load CVSU logo
    const logoPath = path.join(process.cwd(), 'public', 'cvsu_logo.png');
    let logoBase64 = null;
    
    try {
      const logoBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (error) {
      console.error('Logo not found:', error);
    }

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

// Updated HTML template with proper styling and spacing
const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <title>Recommendation Letter</title>
  <style>
    /* Force A4 print size */
    @page {
      size: A4;
      margin: 0;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: white;
      font-family: "Times New Roman", serif;
      font-size: 12pt;
      line-height: 1.2;
    }
    .page {
        width: 210mm;
        height: 297mm;
        padding: 10mm 25mm 25mm 25mm; /* Reduced top padding from 15mm to 10mm */
        box-sizing: border-box;
        position: relative;
        page-break-after: always;
    }
    .page:last-child {
      page-break-after: avoid;
    }
    .form-number {
      font-size: 9pt;
      font-style: italic;
      text-align: right;
      margin-bottom: 0.5em;
    }
    .header {
      display: grid;
      grid-template-columns: 1fr 2fr 1fr;
      align-items: flex-start;
      margin-bottom: 0.5em;
      gap: 10px;
    }
    .logo-section {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .logo-section img {
      max-height: 80px;
      width: auto;
    }
    .university-info {
      text-align: center;
    }
    .university-info div { 
      margin: 0.1em 0; 
    }
      .university-name {
      font-size: 14pt;
      font-weight: bold;
    }
    .spacer {
      /* Empty column for balance */
    }
    .college-name {
      text-align: center;
      font-weight: bold;
      font-size: 11pt;
      margin: 0.5em 0 1.5em 0;
    }
    p { margin: 0.8em 0; text-align: justify; }
    .greeting { margin-bottom: 1.5em; }
    .signature-block { margin-top: 3em; }
    .signature { 
      margin-top: 3em; 
    }
    .signature p {
      margin: 0.2em 0;
    }
    .placeholder { font-weight: bold; }
    .normal-text { font-weight: normal; }
    
    /* Ensure proper page breaks */
    @media print {
      .page {
        page-break-inside: avoid;
        page-break-after: always;
      }
      .page:last-child {
        page-break-after: auto;
      }
    }
  </style>
  </head>
  <body>
  ${submissions.map((submission, index) => {
    // Extract first name from representative_name
    const firstName = submission.representative_name 
      ? submission.representative_name.split(' ')[0] 
      : '';
    
    // Create salutation with first name
    const titleMap = {
      'Mr.': 'Sir',
      'Ms.': 'Ma\'am',
      'Mrs.': 'Ma\'am',
      'Miss': 'Miss'
    };
    
    const title = submission.representative_title || 'Sir/Ma\'am';
    const salutation = titleMap[title] || title;
    const greeting = firstName 
      ? `${salutation} ${firstName}` 
      : salutation;
    
    return `
    <div class="page">

      <div class="form-number">CEIT-OJT-Form 3</div>

      <div class="header">
        <div class="logo-section">
          ${logoBase64 ? `<img src="${logoBase64}" alt="University Logo">` : ''}
        </div>
        <div class="university-info">
          <div>Republic of the Philippines</div>
          <div class="university-name"><strong>CAVITE STATE UNIVERSITY</strong></div>
          <div><strong>Don Severino de las Alas Campus</strong></div>
          <div>Indang, Cavite</div>
        </div>
        <div class="spacer"></div>
      </div>
        <br>
      <div class="college-name">COLLEGE OF ENGINEERING AND INFORMATION TECHNOLOGY</div>
        <br>
      <p><span class="normal-text">${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}</span></p>
      
      <br>

      <p>
        <span class="normal-text">${submission.representative_title || 'Mr./Ms.'.toUpperCase()} ${submission.representative_name || 'N/A'.toUpperCase()}</span><br>
        <span class="normal-text">${submission.representative_designation || 'Manager'}</span><br>
        <span class="placeholder">${submission.company_name || 'N/A'}</span><br>
        <span class="normal-text">${submission.company_address || 'N/A'}</span>
      </p>
      
      <p class="greeting">Dear <span class="normal-text">${greeting}</span>,</p>

      <p>
        The College of Engineering and Information Technology of this University has included the Practicum Training program as a curricular requirement for <strong>Bachelor of Science in Computer Science.</strong> The program seeks to expose the students to actual fieldwork for them to develop self-confidence once they enter the world of employment.
      </p>

      <p>
        Believing that your agency can be one of those that can help our college accomplish this humble objective, may I request your office to be one of our host training establishments / industry partners for this purpose. Should this request merit your approval, I am endorsing our student,
        <span class="placeholder">${submission.student_name || 'N/A'}</span>, who will be trained in your office for the duration of
        <span class="normal-text">240</span> hours.
      </p>

      <p>
        Rest assured that from time to time our coordinator will be communicating with you to facilitate smooth conduct of the program.
      </p>

      <p>I hope that this request merits your kind consideration.</p>

      <div class="signature-block">
        <p>Very truly yours,</p>
        <br><br>
        <p><strong>WILLIE C. BUCLATIN, PhD, ASEAN Eng</strong><br>
        Dean</p>
      </div>

      <div class="signature">
        <p>Conforme:________________________________________</p>
        <p>Agency Head / Manager / Authorized Representative</p>
        <br>
        <p>Date signed: ____________________</p>
      </div>

    </div>
    `;
  }).join('')}
  </body>
  </html>
`;

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate PDF with proper page settings
    const pdfBuffer = await page.pdf({ 
        format: "A4",
        margin: { top: "0", right: "0", bottom: "0", left: "0" }, /* Set all to 0 */
        printBackground: true
    });

    await browser.close();

    const fileName = `recommendation_letters_${new Date().toISOString().split('T')[0]}.pdf`;

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error generating recommendation letters PDF:', error);
    return new Response(
      JSON.stringify({ error: "Failed to generate PDF", details: error.message }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}