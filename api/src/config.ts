import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (err) {
    console.error('Erro ao conectar com MongoDB', err);
    process.exit(1);
  }
};

export default connectDB;
