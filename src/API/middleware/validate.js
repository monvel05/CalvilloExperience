const validateRegister = (req, res, next) => {
    const { correo, contraseña } = req.body;
    
    // Validaciones básicas
    if (!correo || !correo.includes('@')) {
        return res.status(400).json({ message: "Correo inválido" });
    }
    if (!contraseña || contraseña.length < 6) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }
    
    next(); // Si todo está bien, pasa a la siguiente función
};

module.exports = { validateRegister };