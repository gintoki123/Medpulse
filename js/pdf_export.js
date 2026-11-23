// --- PDF Export Functionality ---

// Function to load jsPDF library dynamically
function loadJsPDF(callback) {
    const existingScript = document.getElementById("jspdf-script");
    if (existingScript) {
        // Library already loaded
        if (typeof jspdf !== "undefined") {
            callback();
        } else {
            // Wait for it to load if script exists but library isn't ready
            existingScript.addEventListener("load", callback);
            existingScript.addEventListener("error", () => {
                console.error("Failed to load jsPDF library from existing script tag.");
                alert("Error loading PDF library. Please try again later.");
            });
        }
        return;
    }

    const script = document.createElement("script");
    script.id = "jspdf-script";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = callback;
    script.onerror = () => {
        console.error("Failed to load jsPDF library from CDN.");
        alert("Error loading PDF library. Please try again later.");
    };
    document.body.appendChild(script);
}

// Function to generate the PDF report
function generatePDFReport() {
    // Ensure jsPDF is loaded before generating
    loadJsPDF(() => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const pageHeight = doc.internal.pageSize.height;
            let y = 20; // Initial Y position
            const margin = 15;
            const maxLineWidth = doc.internal.pageSize.width - margin * 2;

            // Add Header with Branding
            // Placeholder for logo - requires image loading/embedding which is complex in jsPDF
            // doc.addImage(logoDataUrl, "PNG", margin, 5, 20, 20);
            doc.setFontSize(18);
            doc.setFont(undefined, "bold");
            doc.text("MediPulse Medical Session Report", doc.internal.pageSize.width / 2, y, { align: "center" });
            y += 10;

            // Add Timestamp
            doc.setFontSize(10);
            doc.setFont(undefined, "normal");
            doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
            y += 10;

            // Add Chat History
            doc.setFontSize(12);
            doc.setFont(undefined, "bold");
            doc.text("Chat History:", margin, y);
            y += 7;

            doc.setFontSize(10);
            chatHistory.forEach(msg => {
                if (y > pageHeight - 20) { // Check for page break
                    doc.addPage();
                    y = 20; // Reset Y for new page
                }
                
                doc.setFont(undefined, "bold");
                doc.text(`${msg.sender}:`, margin, y);
                y += 5;
                
                doc.setFont(undefined, "normal");
                // Split long messages to fit page width
                const messageLines = doc.splitTextToSize(msg.message.replace(/<[^>]*>/g, "), maxLineWidth);
                doc.text(messageLines, margin, y);
                y += (messageLines.length * 4) + 3; // Adjust Y based on number of lines
            });

            // Add Disclaimer
            if (y > pageHeight - 30) { // Check for page break before disclaimer
                doc.addPage();
                y = 20;
            }
            y += 10;
            doc.setFontSize(8);
            doc.setFont(undefined, "italic");
            const disclaimer = "Disclaimer: MediPulse is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.";
            const disclaimerLines = doc.splitTextToSize(disclaimer, maxLineWidth);
            doc.text(disclaimerLines, margin, y);

            // Save the PDF
            const timestamp = new Date().toISOString().replace(/[:.-]/g, ").slice(0, 15);
            doc.save(`MediPulse_Report_${timestamp}.pdf`);
            playSound("alert");

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("An error occurred while generating the PDF report.");
        }
    });
}

// --- Integration into UI ---

// Add "Download Report" button to the dropdown menu (assuming it exists in HTML)
function addDownloadReportButtonListener() {
    const downloadButton = document.getElementById("download-report");
    if (downloadButton) {
        downloadButton.addEventListener("click", () => {
            generatePDFReport();
            dropdownMenu.classList.remove("show"); // Close menu after click
            playSound("click");
        });
    } else {
        // If button doesn't exist in HTML, dynamically add it to the dropdown
        const dropdown = document.getElementById("dropdown-menu");
        if (dropdown) {
            const downloadItem = document.createElement("div");
            downloadItem.className = "dropdown-item";
            downloadItem.id = "download-report";
            downloadItem.innerHTML = 
                '<i class="fas fa-file-pdf"></i> Download Report';
            
            downloadItem.addEventListener("click", () => {
                generatePDFReport();
                dropdownMenu.classList.remove("show"); // Close menu after click
                playSound("click");
            });
            
            // Insert before the 'About' item or at the end
            const aboutItem = document.getElementById("about-app");
            if (aboutItem) {
                dropdown.insertBefore(downloadItem, aboutItem);
            } else {
                dropdown.appendChild(downloadItem);
            }
        }
    }
}

// Modify initializeEventListeners to include the new listener
function enhanceInitializeEventListeners(originalFunction) {
    return function() {
        originalFunction(); // Call the original event listeners setup
        addDownloadReportButtonListener(); // Add our new listener
    };
}

// Apply the enhancement when the document is loaded
document.addEventListener("DOMContentLoaded", () => {
    if (window.initializeEventListeners) {
        const originalInit = window.initializeEventListeners;
        window.initializeEventListeners = enhanceInitializeEventListeners(originalInit);
        // If initializeEventListeners was already called, call the new part manually
        if (document.readyState === "complete" || document.readyState === "interactive") {
             addDownloadReportButtonListener();
        }
    }
});

