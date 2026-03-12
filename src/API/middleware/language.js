const detectLanguage = (req, res, next) => {
    // Leemos el header que manda el interceptor de Angular
    const langHeader = req.headers['accept-language'] || 'es';
    
    // Nos aseguramos de tomar solo las dos primeras letras ('es' o 'en')
    req.lang = langHeader.substring(0, 2) === 'en' ? 'en' : 'es'; 
    
    next();
};

// Exportamos la función
module.exports = detectLanguage;