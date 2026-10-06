/**
 * Homely - PDF Receipt & Contract Generation Service
 * Generates official, printable PDF Rent Receipts (Recibos de Renda IRS) and Lease Contracts.
 */

export class PDFService {
  /**
   * Generate & Download Official Rent Receipt PDF (Portugal & EU Standards)
   */
  downloadReceiptPDF(payment, tenantUser, property, unit) {
    const receiptNum = `REC-2026-${payment.id ? payment.id.replace('pay_', '') : Math.floor(100000 + Math.random() * 900000)}`;
    const paidDate = payment.paidAt ? new Date(payment.paidAt).toLocaleDateString("pt-PT") : new Date().toLocaleDateString("pt-PT");
    const tenantName = tenantUser ? tenantUser.name : "Inquilino / Resident";
    const tenantNif = tenantUser && tenantUser.nif ? tenantUser.nif : "248192039";
    const propName = property ? property.name : "Imóvel Homely";
    const propAddr = property ? property.address : "Lisboa, Portugal";
    const unitNum = unit ? unit.number : "Fração Autónoma";
    const method = payment.paymentMethod || "MB WAY / SEPA";
    const amount = payment.amount ? payment.amount.toLocaleString() : "1.200";

    const printWindow = window.open("", "_blank", "width=800,height=900");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Recibo_de_Renda_${receiptNum}.pdf</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1c1a17; padding: 40px; margin: 0; background: #fff; }
          .header { border-bottom: 2px solid #1c1a17; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
          .brand { font-family: Georgia, serif; font-size: 28px; font-weight: bold; letter-spacing: 0.05em; color: #1c1a17; }
          .doc-title { text-align: right; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; }
          .receipt-num { font-size: 20px; font-weight: bold; color: #10b981; margin-top: 4px; font-family: monospace; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
          .box { background: #fcfbfa; border: 1px solid #e2ded9; border-radius: 8px; padding: 20px; }
          .box h4 { margin: 0 0 12px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; }
          .box p { margin: 4px 0; font-size: 14px; color: #1c1a17; }
          .amount-banner { background: #1c1a17; color: #ffffff; padding: 24px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
          .amount-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.7); margin-bottom: 6px; }
          .amount-val { font-size: 36px; font-weight: bold; font-family: Georgia, serif; color: #ffffff; }
          .footer { font-size: 11px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 20px; margin-top: 40px; }
          .stamp { inline-block; background: #ecfdf5; border: 1px solid #10b981; color: #047857; font-weight: bold; font-size: 11px; padding: 6px 12px; border-radius: 20px; margin-top: 10px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom:20px; text-align:right;">
          <button onclick="window.print()" style="background:#1c1a17; color:#fff; border:none; padding:12px 24px; border-radius:6px; font-weight:bold; cursor:pointer;">
            🖨️ Imprimir / Guardar como PDF
          </button>
        </div>

        <div class="header">
          <div>
            <div class="brand">HOMELY</div>
            <p style="font-size:12px; color:#666; margin:4px 0 0 0;">Gestão Imobiliária Directa • Portugal & UE</p>
          </div>
          <div class="doc-title">
            Recibo de Renda Eletrónico
            <div class="receipt-num">${receiptNum}</div>
          </div>
        </div>

        <div class="amount-banner">
          <div class="amount-label">Valor Liquidade da Renda</div>
          <div class="amount-val">€${amount} EUR</div>
          <div class="stamp">✓ Renda Paga & Emitida via Homely</div>
        </div>

        <div class="grid">
          <div class="box">
            <h4>Dados do Inquilino / Residente</h4>
            <p><strong>Nome:</strong> ${tenantName}</p>
            <p><strong>NIF:</strong> ${tenantNif}</p>
            <p><strong>E-mail:</strong> ${tenantUser ? tenantUser.email : 'inquilino@domain.pt'}</p>
          </div>

          <div class="box">
            <h4>Dados do Imóvel & Fração</h4>
            <p><strong>Imóvel:</strong> ${propName}</p>
            <p><strong>Morada:</strong> ${propAddr}</p>
            <p><strong>Fração:</strong> ${unitNum}</p>
          </div>
        </div>

        <div class="box" style="margin-bottom:30px;">
          <h4>Detalhes da Transação & Pagamento</h4>
          <p><strong>Método de Pagamento:</strong> ${method}</p>
          <p><strong>Data de Liquidação:</strong> ${paidDate}</p>
          <p><strong>Descrição:</strong> Renda Mensal Habitacional</p>
          <p><strong>Enquadramento Fiscal:</strong> Art.º 78.º-E do CIRS (Dedução à Coleta no IRS)</p>
        </div>

        <div class="footer">
          Documento emitido eletronicamente pela Plataforma Homely. Válido para efeitos de verificação fiscal IRS em Portugal e União Europeia.
        </div>

        <script>
          setTimeout(() => { window.print(); }, 500);
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  /**
   * Generate & Download Official Lease Agreement PDF
   */
  downloadLeasePDF(lease, tenantUser, property, unit) {
    const leaseId = lease.id || `LEASE-${Date.now()}`;
    const startDate = lease.startDate || new Date().toISOString().split('T')[0];
    const endDate = lease.endDate || new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0];
    const rent = lease.rent ? lease.rent.toLocaleString() : (unit ? unit.rent.toLocaleString() : "1.200");
    const deposit = lease.deposit ? lease.deposit.toLocaleString() : "2.400";
    const tenantName = tenantUser ? tenantUser.name : "Inquilino";
    const tenantNif = tenantUser && tenantUser.nif ? tenantUser.nif : "248192039";
    const propName = property ? property.name : "Imóvel Homely";
    const propAddr = property ? property.address : "Lisboa, Portugal";
    const unitNum = unit ? unit.number : "Fração Autónoma";

    const printWindow = window.open("", "_blank", "width=850,height=950");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Contrato_de_Arrendamento_${leaseId}.pdf</title>
        <style>
          body { font-family: Georgia, serif; color: #1c1a17; padding: 48px; line-height: 1.6; background: #fff; }
          h1 { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 8px; }
          h2 { text-align: center; font-size: 14px; font-weight: normal; color: #666; margin-top: 0; text-transform: uppercase; letter-spacing: 0.1em; }
          .clause { margin-bottom: 24px; }
          .clause-title { font-weight: bold; font-size: 14px; font-family: sans-serif; text-transform: uppercase; margin-bottom: 6px; }
          .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 60px; padding-top: 20px; border-top: 1px solid #ccc; font-family: sans-serif; }
          .sig-box { text-align: center; }
          .sig-line { border-bottom: 1px solid #1c1a17; height: 40px; margin-bottom: 8px; font-family: cursive; font-size: 20px; line-height: 40px; }
          .no-print { display: none; }
          @media print { .no-print { display: none; } body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom:20px; text-align:right;">
          <button onclick="window.print()" style="background:#1c1a17; color:#fff; border:none; padding:12px 24px; border-radius:6px; font-weight:bold; cursor:pointer;">
            🖨️ Imprimir / Guardar Contrato (PDF)
          </button>
        </div>

        <h1>CONTRATO DE ARRENDAMENTO HABITACIONAL</h1>
        <h2>Legislação Portuguesa & União Europeia (NRAU)</h2>
        <hr style="margin:24px 0; border:none; border-top:1px solid #1c1a17;">

        <div class="clause">
          <div class="clause-title">PRIMEIRA CLÁUSULA - DAS PARTES</div>
          <p>
            <strong>PRIMEIRO OUTORGANTE (SENHORIO):</strong> Proprietário legítimo do imóvel registado no sistema Homely.<br>
            <strong>SEGUNDO OUTORGANTE (INQUILINO):</strong> <strong>${tenantName}</strong>, titular do NIF <strong>${tenantNif}</strong>, registado na plataforma Homely.
          </p>
        </div>

        <div class="clause">
          <div class="clause-title">SEGUNDA CLÁUSULA - DO IMÓVEL</div>
          <p>
            O Senhorio concede em arrendamento ao Inquilino a fração autónoma <strong>${unitNum}</strong> do imóvel <strong>${propName}</strong>, sito em <strong>${propAddr}</strong>.
          </p>
        </div>

        <div class="clause">
          <div class="clause-title">TERCEIRA CLÁUSULA - DA RENDA E CAUÇÃO</div>
          <p>
            1. A renda mensal acordada é de <strong>€${rent} EUR</strong>, a pagar até ao 1.º dia útil do mês a que respeita.<br>
            2. Aquando da assinatura, o Inquilino presta a título de caução o montante de <strong>€${deposit} EUR</strong>.
          </p>
        </div>

        <div class="clause">
          <div class="clause-title">QUARTA CLÁUSULA - DA DURAÇÃO</div>
          <p>
            O presente contrato é celebrado pelo prazo de 1 (um) ano, com início a <strong>${startDate}</strong> e termo em <strong>${endDate}</strong>, renovando-se automaticamente nos termos da lei.
          </p>
        </div>

        <div class="signatures">
          <div class="sig-box">
            <div class="sig-line">✓ Assinado Digitalmente</div>
            <strong>O SENHORIO / PROPRIETÁRIO</strong>
          </div>
          <div class="sig-box">
            <div class="sig-line">${lease.signedName || tenantName}</div>
            <strong>O INQUILINO / RESIDENTE</strong><br>
            <span style="font-size:11px; color:#666;">Assinado a ${new Date().toLocaleDateString('pt-PT')}</span>
          </div>
        </div>

        <script>
          setTimeout(() => { window.print(); }, 500);
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
}

export const pdfService = new PDFService();
