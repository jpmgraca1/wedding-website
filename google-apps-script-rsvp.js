// Google Apps Script para receber RSVP do Website de Casamento
// Cole este código no Editor do Apps Script

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById('1ip8g1OjK6v29WzZby_3PVND5dqjQLAbvqgkxu_qrEbk').getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Adicionar cabeçalhos se a folha estiver vazia
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Data/Hora', 'Primeiro Nome', 'Sobrenome', 'Restrições Alimentares', 'Comentários']);
    }
    
    // Para cada convidado
    data.guests.forEach(function(guest) {
      sheet.appendRow([
        data.timestamp,
        guest.firstName,
        guest.lastName,
        guest.dietaryRestrictions,
        data.comments || ''
      ]);
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'RSVP recebido!' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'API ativa' }))
    .setMimeType(ContentService.MimeType.JSON);
}
