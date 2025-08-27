from pydantic import BaseModel
from typing import Optional

# esquema producto
class ProductoBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    precio: float
    #stock: int

# esquema crear producto
class ProductoCreate(ProductoBase):
    pass

# esquema leer producto
class Producto(ProductoBase):
    id: int

    class Config:
        orm_mode = True #habilita la lectura de datos de objetos orm.
