# Instruções para Atualizar o Google Apps Script

## Alterações Necessárias no Script

O formulário RSVP agora envia um novo campo `guest{i}_dietaryDetails` para cada convidado que tenha restrições alimentares.

### Código Atualizado para `google-apps-script-rsvp.js`

Substitua a função `doPost` pelo código abaixo:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Obter dados do formulário
    var params = e.parameter;
    var timestamp = params.timestamp || new Date().toLocaleString('pt-PT');
    var comments = params.comments || "";
    var guestCount = parseInt(params.guestCount) || 0;
    
    // Preparar dados para cada convidado
    var guests = [];
    for (var i = 0; i < guestCount; i++) {
      var guest = {
        firstName: params['guest' + i + '_firstName'] || "",
        lastName: params['guest' + i + '_lastName'] || "",
        dietary: params['guest' + i + '_dietary'] || "Não",
        dietaryDetails: params['guest' + i + '_dietaryDetails'] || ""
      };
      guests.push(guest);
    }
    
    // Adicionar linha para cada convidado
    guests.forEach(function(guest, index) {
      var rowData = [
        timestamp,
        guest.firstName,
        guest.lastName,
        guest.dietary,
        guest.dietaryDetails,  // ? NOVA COLUNA
        index === 0 ? comments : "",
        index === 0 ? guestCount : ""
      ];
      sheet.appendRow(rowData);
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Dados recebidos com sucesso'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Estrutura da Planilha (Google Sheets)

Certifique-se que a sua planilha tem as seguintes colunas (na ordem):

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Timestamp | Primeiro Nome | Apelido | Restrições Alimentares | Detalhes das Restrições | Comentários | Nº Convidados |

### Exemplo de Cabeçalhos (Linha 1):

```
Timestamp | Primeiro Nome | Apelido | Restrições | Detalhes das Restrições | Comentários | Total
```

## Passos para Atualizar

1. **Abra o Google Apps Script:**
   - Vá para [script.google.com](https://script.google.com)
   - Abra o seu projeto RSVP

2. **Substitua o código:**
   - Cole o código atualizado acima
   - Clique em "Guardar" (??)

3. **Reimplante o script:**
   - Clique em "Implementar" > "Gerir implementações"
   - Clique em "?? Editar" na implementação atual
   - Altere a versão para "Nova versão"
   - Clique em "Implementar"

4. **Atualize a planilha:**
   - Adicione a nova coluna "Detalhes das Restrições" (coluna E)
   - Ajuste os cabeçalhos se necessário

## Teste

Após atualizar, teste enviando um RSVP com:
- ? Sem restrições
- ? Com restrições (deve aparecer a caixa de texto)
- ? Preenchendo os detalhes das restrições

Verifique se os dados aparecem corretamente na planilha!

## Notas

- A coluna "Detalhes das Restrições" ficará vazia se o convidado não tiver restrições
- Cada convidado (incluindo acompanhantes) terá sua própria linha na planilha
- O campo é enviado apenas quando "Tenho restrições alimentares" está marcado
