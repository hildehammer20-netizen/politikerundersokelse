// Google Apps Script – knytt dette til et Google Sheet.
// Bytt e-postadressen før publisering.
const EMAIL_TO = "hilde@oavis.no";

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Tidspunkt", "Navn", "Parti", "Ny periode", "Begrunnelse"]);
  }

  sheet.appendRow([
    new Date(),
    data.name || "",
    data.party || "",
    data.newPeriod || "",
    data.reason || ""
  ]);

  const subject = `Nytt politikersvar: ${data.name || "Ukjent"} (${data.party || "ukjent parti"})`;
  const body =
`Nytt svar i Oppegård Avis' politikerundersøkelse

Navn: ${data.name || ""}
Parti: ${data.party || ""}
Ønsker ny periode: ${data.newPeriod || ""}

Begrunnelse:
${data.reason || ""}

Innsendt: ${data.submittedAt || ""}`;

  MailApp.sendEmail(EMAIL_TO, subject, body);
  return ContentService.createTextOutput("OK");
}
