// Lim inn URL-en til Google Apps Script-webappen her når den er klar.
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxCrURwJzMN-XWkzOarqN4XSrxbd3EIFkJe6OD6BEndMCr9kYKsc5XyZKB8gGZRtbOPdg/exec";

const form = document.getElementById("surveyForm");
const party = document.getElementById("party");
const followup = document.getElementById("followup");
const reasonLabel = document.getElementById("reasonLabel");
const errorBox = document.getElementById("error");
const submitBtn = document.getElementById("submitBtn");

document.querySelectorAll('input[name="newPeriod"]').forEach(input => {
  input.addEventListener("change", () => {
    followup.classList.toggle("show", selectedPeriod() === "Nei");
    sendHeight();
  });
});

function selectedPeriod() {
  return document.querySelector('input[name="newPeriod"]:checked')?.value || "";
}

function validate() {
  errorBox.textContent = "";
  const name = document.getElementById("name").value.trim();
  if (!name) {
    errorBox.textContent = "Skriv inn navnet ditt.";
    return false;
  }
  if (!party.value) {
    errorBox.textContent = "Velg parti.";
    return false;
  }
  if (!selectedPeriod()) {
    errorBox.textContent = "Velg ett av svaralternativene.";
    return false;
  }
  return true;
}

function sendHeight() {
  setTimeout(() => {
    window.parent?.postMessage({
      type: "oa-survey-height",
      height: document.documentElement.scrollHeight
    }, "*");
  }, 50);
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (!validate()) return;

  const fd = new FormData(form);
  const payload = {
    name: fd.get("name"),
    party: fd.get("party"),
    newPeriod: selectedPeriod(),
    reason: fd.get("reason") || "",
    submittedAt: new Date().toISOString()
  };

  if (!GOOGLE_SCRIPT_URL) {
    alert("Testmodus: Skjemaet fungerer, men Google Apps Script er ikke koblet til ennå.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Sender …";

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    });

    form.classList.add("hidden");
    document.getElementById("surveyIntro").classList.add("hidden");
    document.getElementById("thanks").classList.remove("hidden");
    sendHeight();
  } catch (error) {
    errorBox.textContent = "Noe gikk galt. Prøv igjen.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Ferdig";
  }
});

window.addEventListener("load", sendHeight);
