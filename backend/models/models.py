from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from config.database import Base

class Cliente(Base):
    __tablename__ = "clientes"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(1001), nullable=False)
    apellido = Column(String(100), nullable=False)
    telefono = Column(String(50), nullable=False)
    fechaRegistro = Column(DateTime, default=datetime.utcnow)
    estado = Column(String(50), default="activo")