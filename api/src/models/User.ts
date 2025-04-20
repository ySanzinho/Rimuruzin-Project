import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    idDiscord: { type: String, required: true, unique: true },
    xp: { type: Number, default: 0 },
    nivel: { type: Number, default: 1 },
    moedas: { type: Number, default: 0 },
    badges: { type: [String], default: [], },
    streak: { type: Number, default: 0 },
    ultimaDiaria: { type: Date, default: null },
    sobremim: { type: String, default: 'Nada aqui!'}
});

export default mongoose.model('User', UserSchema);