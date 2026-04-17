from fastapi import FastAPI
from app.api.endpoints import upload, generate

app = FastAPI()

app.include_router(upload.router, prefix="/api")
app.include_router(generate.router, prefix="/api")


@app.get("/")
def read_root():
    return {"Hello": "World"}