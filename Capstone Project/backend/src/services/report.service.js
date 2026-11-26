import PDFDocument from 'pdfkit';

/**
 * Security Assessment Report Generation Service
 * Generates structured JSON reports and PDF binary streams
 */

export const generatePdfReport = (reportData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Header Styling
      doc.rect(0, 0, doc.page.width, 80).fill('#0B132B');

      doc
        .fillColor('#00F0FF')
        .fontSize(22)
        .font('Helvetica-Bold')
        .text('CIPHERSENSE', 50, 25);

      doc
        .fillColor('#A0AEC0')
        .fontSize(10)
        .font('Helvetica')
        .text('AI-POWERED CRYPTANALYSIS & SECURITY ASSESSMENT REPORT', 50, 50);

      doc
        .fillColor('#FFFFFF')
        .fontSize(9)
        .text(`Report ID: ${reportData.reportNumber || 'CS-REP-' + Date.now()}`, 400, 25, { align: 'right' })
        .text(`Date: ${new Date().toLocaleDateString()}`, 400, 40, { align: 'right' });

      doc.moveDown(3);

      // Section: Executive Summary
      doc
        .fillColor('#0F172A')
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('1. Executive Summary', 50, 105);

      doc
        .rect(50, 125, doc.page.width - 100, 70)
        .fill('#F8FAFC')
        .stroke('#E2E8F0');

      const score = reportData.reportData?.summary?.overallScore || 85;
      const risk = reportData.reportData?.summary?.riskLevel || 'Low';
      const riskColor = risk === 'Critical' ? '#EF4444' : risk === 'High' ? '#F97316' : risk === 'Medium' ? '#F59E0B' : '#10B981';

      doc
        .fillColor('#1E293B')
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('Cryptographic Security Score: ', 65, 140, { continued: true })
        .fillColor('#0284C7')
        .text(`${score} / 100`)
        .fillColor('#1E293B')
        .text('Evaluated Risk Level: ', 65, 160, { continued: true })
        .fillColor(riskColor)
        .text(`${risk.toUpperCase()}`);

      doc
        .fillColor('#64748B')
        .fontSize(9)
        .font('Helvetica')
        .text(`Assessor: ${reportData.reportData?.clientInfo?.assessorName || 'Security Analyst'} | System: ${reportData.reportData?.clientInfo?.targetSystem || 'Target Cryptosystem'}`, 65, 178);

      // Section: Technical Cryptanalysis Findings
      let currentY = 215;
      doc
        .fillColor('#0F172A')
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('2. Technical Cryptanalysis Findings', 50, currentY);

      currentY += 25;
      const tech = reportData.reportData?.technicalDetails || {};
      
      const techRows = [
        ['Evaluated Algorithm / Sample', tech.algorithm || 'AES-256-CBC'],
        ['Key Size / Strength', tech.keySize || '256-bit'],
        ['Cipher Family Classification', tech.detectedCipherFamily || 'Modern Block Cipher'],
        ['Shannon Entropy', `${tech.entropy || '7.85'} bits/byte (Ideal: > 7.9)`],
        ['Predictability Rating', `${tech.predictabilityScore || 5}%`],
      ];

      techRows.forEach(([label, val]) => {
        doc
          .fillColor('#475569')
          .fontSize(10)
          .font('Helvetica-Bold')
          .text(label + ':', 60, currentY)
          .font('Helvetica')
          .fillColor('#0F172A')
          .text(String(val), 260, currentY);
        currentY += 18;
      });

      // Section: Identified Vulnerabilities
      currentY += 15;
      doc
        .fillColor('#0F172A')
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('3. Identified Vulnerabilities & Weaknesses', 50, currentY);

      currentY += 20;
      const vulns = reportData.reportData?.vulnerabilities || [];
      if (vulns.length === 0) {
        doc
          .fillColor('#10B981')
          .fontSize(10)
          .font('Helvetica')
          .text('✓ No critical or high-risk cryptographic vulnerabilities detected in the analyzed sample.', 60, currentY);
        currentY += 25;
      } else {
        vulns.forEach((v) => {
          doc
            .fillColor('#DC2626')
            .fontSize(10)
            .font('Helvetica-Bold')
            .text(`• [${v.severity}] ${v.title}`, 60, currentY);
          currentY += 15;
          doc
            .fillColor('#475569')
            .fontSize(9)
            .font('Helvetica')
            .text(`  Remediation: ${v.remediation}`, 60, currentY, { width: doc.page.width - 120 });
          currentY += 25;
        });
      }

      // Section: AI Recommendation
      currentY += 10;
      doc
        .fillColor('#0F172A')
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('4. Recommended Cipher Suite & Hardening', 50, currentY);

      currentY += 20;
      const aiRec = reportData.reportData?.aiRecommendations || {};
      doc
        .fillColor('#1E293B')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(`Recommended Algorithm: ${aiRec.primaryAlgorithm || 'AES-256-GCM'} (${aiRec.recommendedKeySize || '256-bit'})`, 60, currentY);
      
      currentY += 16;
      doc
        .fillColor('#475569')
        .fontSize(9)
        .font('Helvetica')
        .text(aiRec.rationale || 'Deploy authenticated encryption (AES-GCM or ChaCha20-Poly1305) with 256-bit keys to guarantee both privacy and data authenticity against active tampering.', 60, currentY, { width: doc.page.width - 120 });

      // Footer
      doc
        .fontSize(8)
        .fillColor('#94A3B8')
        .text(
          'Generated by CipherSense SOC Toolkit - Confidential Security Assessment Report',
          50,
          doc.page.height - 40,
          { align: 'center' }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
