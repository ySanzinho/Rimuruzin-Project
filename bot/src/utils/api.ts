import axios from 'axios';

const API_URL = 'http://localhost:3001/api';
export async function buscarOuCriarUsuario(id: string) {
    const res = await axios.get(`${API_URL}/user/${id}`);
    return res.data;
}

export async function adicionarXP(id: string, xp: number) {
    const res = await axios.post(`${API_URL}/user/${id}/xp`, { xp });
    return res.data;
}

export async function adicionarMoedas(id: string, moedas: number) {
    const res = await axios.post(`${API_URL}/user/${id}/moedas`, { moedas });
    return res.data;
}

export async function atualizarStreak(id: string, streak: number, ultimaDiaria: string) {
    const res = await axios.post(`${API_URL}/user/${id}/streak`, { streak, ultimaDiaria });
    return res.data;
}

export async function atualizarSobreMim(id: string, sobremim: string) {
    const res = await axios.post(`${API_URL}/user/${id}/sobremim`, { sobremim });
    return res.data;
}