from pydantic import BaseModel, EmailStr 
from typing import Optional
from datetime import datetime

class ClienteBase(BaseModel):
    nombre: str
    apellido: str
    telefono: str
    fechaRegistro: datetime
    estado: str

class ClienteCreate(ClienteBase):
    pass

class ClienteUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    telefono: Optional[str] = None
    fechaRegistro: Optional[datetime] = None
    estado: Optional[str] = None

class ClienteResponse(ClienteBase):
    id: int
    nombre: str
    fechaRegistro: datetime
    estado: str

    class Config:
        orm_mode = True