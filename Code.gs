// Google Apps Script — backend para guardar setlists en Drive
// Instrucciones:
//   1. Ve a https://script.google.com → Nuevo proyecto
//   2. Reemplaza el contenido con este archivo
//   3. Click en "Implementar" → "Nueva implementación"
//   4. Tipo: Aplicacion web
//      Ejecutar como: Yo
//      Quienes tienen acceso: Cualquier persona
//   5. Copia la URL generada y pegala en index.html como SCRIPT_URL

const FOLDER_NAME = 'Setlist Adriana 50 CDO';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const base64 = data.pdf;
    const filename = data.filename || 'Setlist.pdf';

    // Find or create the Drive folder
    const folders = DriveApp.getFoldersByName(FOLDER_NAME);
    const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(FOLDER_NAME);

    // Decode and save
    const bytes = Utilities.base64Decode(base64);
    const blob = Utilities.newBlob(bytes, 'application/pdf', filename);
    const file = folder.createFile(blob);

    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        url: file.getUrl(),
        name: file.getName(),
        id: file.getId()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Health check
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
