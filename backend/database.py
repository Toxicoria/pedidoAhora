from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./test.db"

#crea un motor de DB
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

#crea una base
Base = declarative_base()

#config de la base local
SessionLocal = sessionmaker(autocommit = False, autoflush = False, bind = engine)

# definir el model de la tabla de productos
class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    descripcion = Column(String)
    precio = Column(Float)
    #stock = Column(Integer)

