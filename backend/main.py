from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from . import database, schemas

# recomendacion de gemini, es una capa
# que funciona para la comunicacion segura entre
# el front y el back (??? preguntar despues)
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# aca configura CORS para el acceso a el front React.
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# EndPoints de la API

# endpoint todos los productos
@app.post("/productos/", response_model=schemas.Producto, status_code.HTTP_201_CREATED)
def crearProducto(prooducto: schemas.ProductoCreate, db: Session = Depends(get_db)):
    db_producto = database.Producto(**producto.dict())
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto

@app.get("/productos/{producto_id}", response_model=schemas.Producto)
def obtener_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(database.Producto).filter(database.Producto.id == producto_id).first()
    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

# endpoint para actualizar un producto
@app.put("/productos/{producto_id}", response_model=schemas.Producto)
def actualizarProducto(producto_id: int, producto_actualizado: schemas.ProductoUpdate, db: Session = Depends(get_db)):
    db_producto = db.query(database.Producto).filter(database.Producto.id == producto_id).first()
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
        #actualizar campos
        for key, value in producto_actualizado.dict().items():
            setattr(db_producto, key, value)

        db.commit()
        db.refresh(db_producto)
        return {"ok": True}
        