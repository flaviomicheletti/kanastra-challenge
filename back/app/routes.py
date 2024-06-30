from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from typing import List
import os

UPLOAD_DIRECTORY = "./uploads"

if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_location = f"{UPLOAD_DIRECTORY}/{file.filename}"
        with open(file_location, "wb+") as file_object:
            file_object.write(file.file.read())
        return {"filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/files")
async def get_files():
    try:
        files = os.listdir(UPLOAD_DIRECTORY)
        return {"files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
