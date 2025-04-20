import { Router, Request, Response } from 'express';
import User from '../models/User';

const router = Router();

// 📌 Busca ou cria usuário
router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    let user = await User.findOne({ idDiscord: userId });
    if (!user) {
      user = await User.create({ idDiscord: userId });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(`Erro ao buscar/criar usuário ${userId}:`, err);
    res.status(500).json({ erro: 'Erro ao buscar ou criar usuário' });
  }
});

// 📌 Atualiza XP
router.post('/:id/xp', async (req, res) => {
  const userId = req.params.id;
  const { xp } = req.body;

  if (typeof xp !== 'number') return res.status(400).json({ erro: 'XP deve ser um número' });

  try {
    let user = await User.findOne({ idDiscord: userId });

    if (!user) {
      user = new User({ idDiscord: userId, xp: 0, nivel: 1 });
    }

    user.xp += xp;

    // Cálculo de nível
    const xpNecessario = (nivel: number) => 5 * nivel ** 2 + 50 * nivel + 100;

    let subiuNivel = false;
    while (user.xp >= xpNecessario(user.nivel)) {
      user.xp -= xpNecessario(user.nivel);
      user.nivel++;
      subiuNivel = true;
    }

    await user.save();

    res.status(200).json({
      nivel: user.nivel,
      xpAtual: user.xp,
      xpParaProximoNivel: xpNecessario(user.nivel),
      subiuNivel
    });
  } catch (err) {
    console.error(`Erro ao adicionar XP ao usuário ${userId}:`, err);
    res.status(500).json({ erro: 'Erro ao adicionar XP' });
  }
});

// 📌 Atualiza moedas
router.post('/:id/moedas', async (req, res) => {
  const userId = req.params.id;
  const { moedas } = req.body;
  if (typeof moedas !== 'number') return res.status(400).json({ erro: 'Moedas deve ser um número' });

  try {
    const user = await User.findOneAndUpdate(
      { idDiscord: userId },
      { $inc: { moedas } },
      { new: true, upsert: true }
    );
    res.status(200).json(user);
  } catch (err) {
    console.error(`Erro ao atualizar moedas do usuário ${userId}:`, err);
    res.status(500).json({ erro: 'Erro ao atualizar moedas' });
  }
});

// 📌 Adiciona badge
router.post('/:id/badge', async (req, res) => {
  const userId = req.params.id;
  const { badge } = req.body;
  if (typeof badge !== 'string') return res.status(400).json({ erro: 'Badge deve ser uma string' });

  try {
    const user = await User.findOneAndUpdate(
      { idDiscord: userId },
      { $addToSet: { badges: badge } },
      { new: true, upsert: true }
    );
    res.status(200).json(user);
  } catch (err) {
    console.error(`Erro ao adicionar badge ao usuário ${userId}:`, err);
    res.status(500).json({ erro: 'Erro ao adicionar badge' });
  }
});

// 📌 Adiciona streak diario
router.post('/:id/streak', async (req, res) => {
  const userId = req.params.id;
  const { streak, ultimaDiaria } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { idDiscord: userId },
      {
        $set: {
          streak,
          ultimaDiaria: new Date(ultimaDiaria)
        }
      },
      { new: true }
    );

    res.status(200).json(user);
  } catch (err) {
    console.error(`Erro ao atualizar streak do usuário ${userId}:`, err);
    res.status(500).json({ erro: 'Erro ao atualizar streak' });
  }
});

// 📌 Atualiza o "sobre mim"
router.post('/:id/sobremim', async (req, res) => {
  const userId = req.params.id;
  const { sobremim } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { idDiscord: userId },
      { 
        $set: { sobremim } 
      },
      { new: true, upsert: true }
    );

    res.status(200).json(user);
  } catch (err) {
    console.error(`Erro ao atualizar sobreMim do usuário ${userId}:`, err);
    res.status(500).json({ erro: 'Erro ao atualizar sobreMim' });
  }
});


export default router;
