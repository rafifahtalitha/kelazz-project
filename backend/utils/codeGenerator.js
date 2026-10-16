/**
 * Menghasilkan 6 digit kode game acak unik (menghindari karakter ambigu seperti 0, O, I, 1)
 * @returns {string} Contoh: "8K39PZ"
 */
function generateGameCode() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
  
  module.exports = {
    generateGameCode,
  };