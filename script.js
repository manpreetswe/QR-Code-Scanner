function domReady(fn) {
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(fn, 1000);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

domReady(function () {
  const startButton = document.getElementById("start-scan-btn");
  const qrContainer = document.getElementById("my-qr-reader");
  const resultSection = document.getElementById("scan-result");
  const scannedUrlSpan = document.getElementById("scanned-url");
  const openLinkBtn = document.getElementById("open-link-btn");
  const scanAgainBtn = document.getElementById("scan-again-btn");
  const toggle = document.getElementById("darkModeToggle");
  let scanner;

  const beep = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");

  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  }

  function isValidUrl(url) {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  function onScanSuccess(decodedText) {
    beep.play();
    speak("QR code scanned successfully");

    scanner.clear().then(() => {
      document.getElementById("my-qr-reader").innerHTML = "";
      scannedUrlSpan.textContent = decodedText;
      resultSection.classList.remove("hidden");

      openLinkBtn.onclick = () => {
        window.location.href = decodedText;
      };

      scanAgainBtn.onclick = () => {
        resultSection.classList.add("hidden");
        scanner.render(onScanSuccess);
      };
    });
  }

  startButton.addEventListener("click", () => {
    if (!scanner) {
      scanner = new Html5QrcodeScanner("my-qr-reader", { fps: 10, qrbox: 250 });
    }
    scanner.render(onScanSuccess);
    startButton.disabled = true;
    startButton.textContent = "🔍 Scanning...";
  });

  // Dark mode toggle
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("dark", toggle.checked);
    localStorage.setItem("darkMode", toggle.checked);
  });

  // Load dark mode from storage
  const darkPref = localStorage.getItem("darkMode") === "true";
  document.body.classList.toggle("dark", darkPref);
  toggle.checked = darkPref;
});
// Calling a backend server API from frontend
fetch('http://localhost:3000/generate-password') // <- Backend server route
  .then(response => response.json())
  .then(data => {
    console.log("Generated Password:", data.password);
  })
  .catch(err => console.error("Error:", err));
