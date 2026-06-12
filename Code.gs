// Google Apps Script — backend para guardar setlists en Drive
// IMPORTANTE: Implementar como:
//   Ejecutar como: Yo
//   Quienes tienen acceso: Cualquier persona  ← debe ser esta opcion exacta

const FOLDER_NAME = 'Setlist Adriana 50 CDO';

function doPost(e) {
  try {
    var base64, filename;

    // Recibe datos desde form HTML (e.parameter.data)
    if (e.parameter && e.parameter.data) {
      var parsed = JSON.parse(e.parameter.data);
      base64   = parsed.pdf;
      filename = parsed.filename || 'Setlist.pdf';
    } else {
      // Fallback: JSON body directo
      var body = JSON.parse(e.postData.contents);
      base64   = body.pdf;
      filename = body.filename || 'Setlist.pdf';
    }

    var folders = DriveApp.getFoldersByName(FOLDER_NAME);
    var folder  = folders.hasNext() ? folders.next() : DriveApp.createFolder(FOLDER_NAME);

    var bytes = Utilities.base64Decode(base64);
    var blob  = Utilities.newBlob(bytes, 'application/pdf', filename);
    var file  = folder.createFile(blob);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, url: file.getUrl(), name: file.getName() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
