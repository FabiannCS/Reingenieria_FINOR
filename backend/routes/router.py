from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import SessionLocal
from typing import List
from models.models import Cliente
from schema.schemas import ClienteCreate, ClienteResponse, ClienteUpdate

user = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@user.get("/")
def root():
    return {'Menssage': "La API de clientes esta funcionando"}

@user.post("/clientes", response_model=ClienteResponse)
def crear_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    nuevo_cliente = Cliente(
        nombre = cliente.nombre,
        apellido = cliente.apellido,
        telefono = cliente.telefono,
        fechaRegistro = cliente.fechaRegistro,
        estado = cliente.estado   
    )

    db.add(nuevo_cliente)
    db.commit()
    db.refresh(nuevo_cliente)

    return nuevo_cliente

@user.get("/clientes", response_model=List[ClienteResponse])
def obtener_clientes(db: Session = Depends(get_db)):

    clientes = db.query(Cliente).all()
    return clientes

@user.get("/clientes/{cliente_id}", response_model=ClienteResponse)
def obtener_cliente(cliente_id: int, db: Session = Depends(get_db)):

    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    return cliente


@user.put("/clientes/{cliente_id}", response_model=ClienteResponse)
def actualizar_cliente(cliente_id: int, cliente_actualizado: ClienteUpdate, db: Session = Depends(get_db)):

    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    if cliente_actualizado.nombre is not None:
        cliente.nombre = cliente_actualizado.nombre
    if cliente_actualizado.apellido is not None:
        cliente.apellido = cliente_actualizado.apellido
    if cliente_actualizado.telefono is not None:
        cliente.telefono = cliente_actualizado.telefono
    if cliente_actualizado.estado is not None:
        cliente.estado = cliente_actualizado.estado

    db.commit()
    db.refresh(cliente)
    
    return cliente

@user.delete("/clientes/{cliente_id}")
def eliminar_cliente(cliente_id: int, db: Session = Depends(get_db)):

    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    db.delete(cliente)
    db.commit()
    
    return {"mensaje": "Cliente eliminado exitosamente"}