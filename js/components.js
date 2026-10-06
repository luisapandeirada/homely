/**
 * Homely - Shared UI Components
 * Custom rendering logic for toasts, SVGs, line charts, dialogs, and CSV downloads.
 */

// Toast notification class
class ToastSystem {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    this.container = document.getElementById("toast-container");
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "toast-container";
      this.container.className = "toast-container";
      document.body.appendChild(this.container);
    }
  }

  show(message, type = "info") {
    this.init();
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = "💡";
    if (type === "success") icon = "✨";
    if (type === "error") icon = "🚨";
    if (type === "warning") icon = "⚠️";

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "fadeIn 0.25s ease-out reverse forwards";
      setTimeout(() => {
        toast.remove();
      }, 250);
    }, 3000);
  }
}

export const toast = new ToastSystem();

// Stark Neobroker Line Chart (Trade Republic Style)
export function renderFinancialChart(containerElement, payments) {
  if (!containerElement) return;

  // Group payments by date, sorted
  const clearedPayments = payments
    .filter(p => p.status === "Paid")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  if (clearedPayments.length === 0) {
    containerElement.innerHTML = `
      <div style="display:flex; justify-content:center; align-items:center; height:100%; color:var(--text-muted); font-size:12px;">
        No cleared transactions found in index.
      </div>
    `;
    return;
  }

  // Create monthly timeline array
  const monthlyTotals = {};
  clearedPayments.forEach(p => {
    const month = new Date(p.dueDate).toLocaleString('default', { month: 'short', year: '2-digit' });
    monthlyTotals[month] = (monthlyTotals[month] || 0) + p.amount;
  });

  const months = Object.keys(monthlyTotals);
  const values = months.map(m => monthlyTotals[m]);
  
  // Calculate cumulative yields for wealth growth curve
  let cumulative = 0;
  const cumulativeValues = values.map(v => {
    cumulative += v;
    return cumulative;
  });

  const maxVal = Math.max(...cumulativeValues, 1000);
  const minVal = 0;
  const range = maxVal - minVal;

  // Chart Dimension Settings
  const width = containerElement.clientWidth || 500;
  const height = 180;
  const padding = 20;

  // Map data to coordinates
  const points = cumulativeValues.map((val, idx) => {
    const x = padding + (idx / (cumulativeValues.length - 1 || 1)) * (width - padding * 2);
    const y = height - padding - ((val - minVal) / range) * (height - padding * 2);
    return { x, y, val, month: months[idx] };
  });

  // Build SVG Path strings
  const pathD = points.reduce((acc, p, idx) => {
    return acc + `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y} `;
  }, "");

  // Area path (closed loop back to bottom for gradient fill)
  const areaD = pathD + `L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  // Render SVG
  containerElement.innerHTML = `
    <!-- Grid Lines -->
    <div class="chart-grid-line" style="bottom: 25%"></div>
    <div class="chart-grid-line" style="bottom: 50%"></div>
    <div class="chart-grid-line" style="bottom: 75%"></div>
    
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" style="overflow:visible;">
      <defs>
        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--primary-color)" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      
      <!-- Gradient Area -->
      ${points.length > 1 ? `<path d="${areaD}" fill="url(#chart-grad)"></path>` : ''}
      
      <!-- Line Path -->
      <path d="${pathD}" fill="none" stroke="var(--primary-color)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
      
      <!-- Interactive Nodes -->
      ${points.map((p, idx) => `
        <g class="chart-node" style="cursor:pointer;">
          <circle cx="${p.x}" cy="${p.y}" r="4" fill="var(--bg-app)" stroke="var(--primary-color)" stroke-width="2" id="node-${idx}"></circle>
          <!-- Hover larger hot zone -->
          <circle cx="${p.x}" cy="${p.y}" r="12" fill="transparent" 
            onmouseover="document.getElementById('tooltip-${idx}').setAttribute('visibility', 'visible'); document.getElementById('node-${idx}').setAttribute('r', '6');"
            onmouseout="document.getElementById('tooltip-${idx}').setAttribute('visibility', 'hidden'); document.getElementById('node-${idx}').setAttribute('r', '4');"
          ></circle>
          
          <!-- Stark Floating Tooltip -->
          <g id="tooltip-${idx}" visibility="hidden" transform="translate(${p.x - 50}, ${p.y - 35})">
            <rect width="100" height="24" rx="4" fill="#000" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.15))"></rect>
            <text x="50" y="15" fill="#fff" font-size="10" font-weight="700" text-anchor="middle" font-family="system-ui">
              ${p.month}: $${p.val.toLocaleString()}
            </text>
          </g>
        </g>
      `).join("")}
      
      <!-- Month labels -->
      ${points.map((p, idx) => `
        <text x="${p.x}" y="${height - 2}" fill="var(--text-muted)" font-size="10" font-weight="600" text-anchor="middle" font-family="var(--font-sans)">
          ${p.month}
        </text>
      `).join("")}
    </svg>
  `;
}

// Occupancy gauge generator
export function renderOccupancyGauge(containerElement, properties) {
  if (!containerElement) return;

  let totalUnits = 0;
  let occupiedUnits = 0;

  properties.forEach(p => {
    p.units.forEach(u => {
      totalUnits++;
      if (u.status === "Occupied") occupiedUnits++;
    });
  });

  const percentage = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  
  containerElement.innerHTML = `
    <div style="position: relative; width: 80px; height: 80px; margin: 0 auto;">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="32" fill="none" stroke="var(--glass-border)" stroke-width="6"></circle>
        <circle cx="40" cy="40" r="32" fill="none" 
          stroke="var(--primary-color)" 
          stroke-width="6" 
          stroke-dasharray="201.06" 
          stroke-dashoffset="${201.06 - (201.06 * percentage) / 100}" 
          stroke-linecap="round"
          transform="rotate(-90 40 40)"
          style="transition: stroke-dashoffset 0.8s ease-in-out;"
        ></circle>
      </svg>
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
        <span style="font-family: var(--font-sans); font-size: 16px; font-weight: 700;">${percentage}%</span>
      </div>
    </div>
  `;
}

// Generic Dialog Manager
export function createDialog({ title, contentHTML, submitLabel = "Save", onSubmit, onClose }) {
  const dialog = document.createElement("dialog");
  
  dialog.innerHTML = `
    <div class="modal-content glass-panel">
      <div class="modal-header">
        <h3 style="font-size:18px; font-weight:800; letter-spacing:-0.02em;">${title}</h3>
        <button class="btn-circle close-btn" style="width:28px; height:28px; font-size:16px;">&times;</button>
      </div>
      <form id="dialog-form">
        <div class="modal-body">
          ${contentHTML}
        </div>
        <div class="modal-actions" style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px;">
          <button type="button" class="btn btn-secondary cancel-btn" style="padding:6px 12px; font-size:12px;">Cancel</button>
          <button type="submit" class="btn btn-primary" style="padding:6px 12px; font-size:12px; border-radius:4px;">${submitLabel}</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(dialog);
  dialog.showModal();

  const form = dialog.querySelector("#dialog-form");
  const closeBtn = dialog.querySelector(".close-btn");
  const cancelBtn = dialog.querySelector(".cancel-btn");

  const cleanup = () => {
    dialog.close();
    dialog.remove();
    if (onClose) onClose();
  };

  closeBtn.addEventListener("click", cleanup);
  cancelBtn.addEventListener("click", cleanup);
  
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) cleanup();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    
    onSubmit(data);
    cleanup();
  });
}

// CSV download trigger utility
export function downloadCSV(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Fintech OCR Receipt Parser Modal
export function runMockOCRScan(fileName, onParsed) {
  const modal = document.createElement("div");
  modal.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.65); display:flex; align-items:center; justify-content:center; z-index:2000; font-family:var(--font-sans);";
  modal.innerHTML = `
    <div class="glass-panel" style="width:380px; padding:24px; text-align:center; position:relative; overflow:hidden; background:var(--bg-app); border:1px solid var(--glass-border); border-radius:8px;">
      <div style="font-size:32px; margin-bottom:12px;">📄</div>
      <h4 style="font-weight:800; margin-bottom:6px; font-size:15px; letter-spacing:-0.01em;">Fintech OCR Receipt Parser</h4>
      <p style="font-size:12px; color:var(--text-muted); margin-bottom:20px;">Scanning: <strong>${fileName}</strong></p>
      
      <div style="position:relative; width:100%; height:80px; background:var(--glass-bg-accent); border:1.5px dashed var(--glass-border); border-radius:6px; overflow:hidden; margin-bottom:20px;">
        <div id="ocr-scan-bar" style="position:absolute; left:0; top:0; width:100%; height:3px; background:var(--primary-color); opacity:0.8; box-shadow:0 0 8px var(--primary-color);"></div>
        <div style="font-family:monospace; font-size:10px; color:var(--text-muted); text-align:left; padding:8px; line-height:1.3; user-select:none; opacity:0.6; white-space:pre-line;" id="ocr-scan-text">
          [OCR INITIALIZING]...
          CONNECTING CORE CAPTURE...
        </div>
      </div>
      <div style="font-size:11px; font-weight:700; color:var(--primary-color);" id="ocr-scan-status">Extracting transaction balances...</div>
    </div>
  `;
  document.body.appendChild(modal);

  const scanBar = modal.querySelector("#ocr-scan-bar");
  const scanText = modal.querySelector("#ocr-scan-text");
  const scanStatus = modal.querySelector("#ocr-scan-status");

  let topVal = 0;
  let dir = 1.5;
  const animateScan = setInterval(() => {
    topVal += dir;
    if (topVal >= 77 || topVal <= 0) dir = -dir;
    scanBar.style.top = `${topVal}px`;
  }, 20);

  const mockTextSteps = [
    "Plumbing Invoice #10292\nApex Plumbing Solutions\nDATE: 2026-06-02",
    "Apex Plumbing Solutions\nITEMS: Pipe Gaskets, Plunge work\nTOTAL: $280.00",
    "TOTAL DUE: $280.00\nTAX CATEGORY: Repairs & Maintenance\nSTATUS: Paid Cash",
    "SUCCESS: Parsed sum of $280.00!"
  ];

  let step = 0;
  const updateText = setInterval(() => {
    if (step < mockTextSteps.length) {
      scanText.innerText = mockTextSteps[step];
      step++;
    }
  }, 600);

  setTimeout(() => {
    clearInterval(animateScan);
    clearInterval(updateText);
    modal.remove();
    
    let cost = 280;
    let taxCategory = "Repairs";
    if (fileName.toLowerCase().includes("electric") || fileName.toLowerCase().includes("wire")) {
      cost = 180;
      taxCategory = "Repairs";
    } else if (fileName.toLowerCase().includes("clean") || fileName.toLowerCase().includes("sweep")) {
      cost = 95;
      taxCategory = "Cleaning & Maintenance";
    } else if (fileName.toLowerCase().includes("tax") || fileName.toLowerCase().includes("gov")) {
      cost = 450;
      taxCategory = "Taxes";
    } else if (fileName.toLowerCase().includes("insur")) {
      cost = 120;
      taxCategory = "Insurance";
    } else {
      cost = Math.floor(80 + Math.random() * 200);
      taxCategory = "Repairs";
    }

    onParsed({ cost, taxCategory });
  }, 2800);
}

// Stripe Connect Split Diagram
export function renderStripeSplitDiagram(containerElement, amount) {
  if (!containerElement) return;
  const platformCut = Math.round(amount * 0.05);
  const landlordCut = amount - platformCut;
  
  containerElement.innerHTML = `
    <div class="stripe-split-diagram" style="display:flex; flex-direction:column; gap:12px; background:var(--bg-app); border:1px solid var(--glass-border); padding:16px; border-radius:6px; font-family:var(--font-sans); margin-bottom:15px; margin-top:5px;">
      <div style="font-size:10px; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; display:flex; align-items:center; justify-content:space-between;">
        <span>Stripe Connect Split Flow</span>
        <span style="color:#635bff; font-weight:900;">stripe</span>
      </div>
      
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; position:relative; padding:10px 0;">
        <div style="background:#635bff; color:#fff; border-radius:4px; padding:6px 10px; font-size:11px; font-weight:700; text-align:center; min-width:80px; z-index:2;">
          Rent Paid<br/>$${amount.toLocaleString()}
        </div>
        
        <div style="position:absolute; top:50%; left:40px; right:40px; height:1px; background:var(--glass-border); z-index:1;"></div>
        
        <div style="display:flex; flex-direction:column; gap:8px; z-index:2;">
          <div style="background:var(--glass-bg-accent); border:1px solid #10b981; border-left-width:3px; padding:4px 8px; border-radius:4px; font-size:10px; min-width:140px; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:600;">Landlord Ledger (95%)</span>
            <strong style="color:#10b981;">$${landlordCut.toLocaleString()}</strong>
          </div>
          <div style="background:var(--glass-bg-accent); border:1px solid var(--primary-color); border-left-width:3px; padding:4px 8px; border-radius:4px; font-size:10px; min-width:140px; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:600;">Reserves Wallet (5%)</span>
            <strong style="color:var(--primary-color);">$${platformCut.toLocaleString()}</strong>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Lease signature canvas draw builder
export function initSignaturePad(canvas, clearBtn, onChange) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";

  let drawing = false;

  const getMousePos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    drawing = true;
    const pos = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    e.preventDefault();
  };

  const draw = (e) => {
    if (!drawing) return;
    const pos = getMousePos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    if (onChange) onChange(true);
    e.preventDefault();
  };

  const stopDrawing = () => {
    drawing = false;
  };

  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseleave", stopDrawing);

  canvas.addEventListener("touchstart", startDrawing);
  canvas.addEventListener("touchmove", draw);
  canvas.addEventListener("touchend", stopDrawing);

  if (clearBtn) {
    clearBtn.addEventListener("click", (e) => {
      e.preventDefault();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (onChange) onChange(false);
    });
  }
}

// 5. Interactive Building Floor Plan Grid Map Renderer
export function renderFloorPlan(containerElement, properties, requests, users, onUnitClick) {
  if (!containerElement) return;

  containerElement.innerHTML = `
    <div class="floor-plan-map" style="display:flex; flex-direction:column; gap:15px; font-family:var(--font-sans);">
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px;">
        ${properties.map(p => {
          return `
            <div class="glass-panel" style="padding:16px; border:1px solid var(--glass-border); border-radius:6px; display:flex; flex-direction:column; gap:12px; background:var(--glass-bg);">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:800; font-size:12px; color:var(--text-main); text-transform:uppercase; letter-spacing:0.02em;">${p.name.split(" ")[0]} Portfolio</span>
                <span style="font-size:10px; color:var(--text-muted); font-weight:700; background:var(--glass-bg-accent); padding:2px 6px; border-radius:3px;">${p.type}</span>
              </div>
              <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px;">
                ${p.units.map(u => {
                  const hasIssue = requests.some(r => r.unitId === u.id && r.status !== "Resolved");
                  let statusColor = "var(--text-muted)";
                  let bg = "var(--glass-bg-accent)";
                  let border = "1px solid var(--glass-border)";
                  
                  if (hasIssue) {
                    statusColor = "#ef4444";
                    bg = "rgba(239, 68, 68, 0.08)";
                    border = "1.5px solid #ef4444";
                  } else if (u.status === "Occupied") {
                    statusColor = "#10b981";
                    bg = "rgba(16, 185, 129, 0.08)";
                    border = "1.5px solid #10b981";
                  }
                  
                  const tenantName = u.tenantId ? (users[u.tenantId]?.name || "Renter") : "Vacant";
                  const rentStr = `$${u.rent.toLocaleString()}/mo`;
                  const issueText = hasIssue ? requests.find(r => r.unitId === u.id && r.status !== "Resolved").title : "No open logs";

                  return `
                    <div class="floor-plan-unit-block" data-prop-id="${p.id}" data-unit-id="${u.id}" style="background:${bg}; border:${border}; border-radius:4px; padding:12px 6px; text-align:center; cursor:pointer; position:relative; transition:transform 0.15s ease;"
                      onmouseover="this.style.transform='scale(1.03)'" 
                      onmouseout="this.style.transform='scale(1)'"
                    >
                      <div style="font-weight:800; font-size:11px; color:var(--text-main);">${u.number}</div>
                      <div style="display:flex; justify-content:center; align-items:center; gap:4px; margin-top:6px;">
                        <span style="width:6px; height:6px; background:${statusColor}; border-radius:50%;"></span>
                        <span style="font-size:8px; font-weight:700; text-transform:uppercase; color:var(--text-muted);">${hasIssue ? 'Alert' : u.status}</span>
                      </div>
                      
                      <!-- Tooltip -->
                      <div class="floor-plan-tooltip" style="visibility:hidden; width:160px; background:#000000; color:#ffffff; text-align:left; border-radius:4px; padding:8px; position:absolute; z-index:100; bottom:110%; left:50%; margin-left:-80px; opacity:0; transition:opacity 0.2s; font-size:10px; line-height:1.3; pointer-events:none; box-shadow:0 4px 12px rgba(0,0,0,0.25);">
                        <strong style="display:block; margin-bottom:2px; color:var(--primary-color);">${u.number}</strong>
                        <span>Occupant: <strong>${tenantName}</strong></span><br/>
                        <span>Rent Rate: <strong>${rentStr}</strong></span><br/>
                        <span style="color:${hasIssue ? '#ff6b6b' : '#a8ffb2'};">Logs: ${issueText}</span>
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;

  // Bind click handlers to unit blocks
  containerElement.querySelectorAll(".floor-plan-unit-block").forEach(block => {
    block.addEventListener("click", () => {
      const propId = block.getAttribute("data-prop-id");
      const unitId = block.getAttribute("data-unit-id");
      if (onUnitClick) onUnitClick(propId, unitId);
    });

    const tooltip = block.querySelector(".floor-plan-tooltip");
    block.addEventListener("mouseenter", () => {
      if (tooltip) {
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = "0.95";
      }
    });
    block.addEventListener("mouseleave", () => {
      if (tooltip) {
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
      }
    });
  });
}

// 6. Contractor Quote Bidding room Matrix Renderer
export function renderBiddingMatrix(containerElement, request, onAccept) {
  if (!containerElement || !request.bids || request.bids.length === 0) return;

  containerElement.innerHTML = `
    <div style="margin-bottom:15px; border:1px solid var(--glass-border); border-radius:6px; overflow:hidden; background:var(--glass-bg-accent);">
      <div style="background:var(--glass-bg); padding:10px 12px; border-bottom:1px solid var(--glass-border); font-size:11px; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; display:flex; justify-content:space-between; align-items:center;">
        <span>Contractor Bidding quotes</span>
        <span style="font-size:9px; background:rgba(245,158,11,0.1); color:#f59e0b; padding:2px 6px; border-radius:4px; font-weight:700;">Compare & Hire</span>
      </div>
      <div style="padding:10px; overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; font-size:11px; text-align:left;">
          <thead>
            <tr style="border-bottom:1px solid var(--glass-border); color:var(--text-muted); font-weight:700;">
              <th style="padding:6px 4px;">Contractor</th>
              <th style="padding:6px 4px;">Trade</th>
              <th style="padding:6px 4px;">Rating</th>
              <th style="padding:6px 4px;">Quote</th>
              <th style="padding:6px 4px;">Est. Time</th>
              <th style="padding:6px 4px; text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${request.bids.map(b => {
              const isTradeMatch = b.trade.toLowerCase() === request.trade.toLowerCase();
              const badgeStyle = isTradeMatch ? 'background:rgba(16,185,129,0.08); color:#10b981;' : 'background:rgba(100,100,100,0.06); color:var(--text-muted);';
              return `
                <tr style="border-bottom:1px solid var(--glass-border); vertical-align:middle;">
                  <td style="padding:8px 4px; font-weight:700; color:var(--text-main);">${b.contractorName}</td>
                  <td style="padding:8px 4px;">
                    <span style="font-size:9px; padding:2px 4px; border-radius:3px; font-weight:700; ${badgeStyle}">${b.trade}</span>
                  </td>
                  <td style="padding:8px 4px; font-weight:600; color:#f59e0b;">${b.rating}</td>
                  <td style="padding:8px 4px; font-weight:800; color:var(--text-main); font-family:var(--font-sans);">$${b.cost}</td>
                  <td style="padding:8px 4px; font-weight:600; color:var(--text-muted);">${b.duration} Day${b.duration !== 1 ? 's' : ''}</td>
                  <td style="padding:8px 4px; text-align:right;">
                    <button type="button" class="btn btn-primary accept-bid-btn" data-contractor-id="${b.contractorId}" data-cost="${b.cost}" style="padding:4px 8px; font-size:10px; border-radius:4px; font-weight:700;">
                      Hire Contractor
                    </button>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Bind action buttons
  containerElement.querySelectorAll(".accept-bid-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const contractorId = btn.getAttribute("data-contractor-id");
      const cost = Number(btn.getAttribute("data-cost"));
      if (onAccept) onAccept(contractorId, cost);
    });
  });
}
