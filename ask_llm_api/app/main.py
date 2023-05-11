import os
import openai
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel as PyBaseModel
from fastapi.middleware.cors import CORSMiddleware

from starlette.status import HTTP_400_BAD_REQUEST

from app.basemodel import BaseModel, LLaMAIndexBaseModel, LangChainBaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model: BaseModel


class ModelParams(PyBaseModel):
    model_name: str
    api_key: str


def check_api_key(api_key: str):
    try:
        openai.api_key = api_key
        openai.Model.list()
    except Exception as e:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=str(e))


@app.post("/select_model")
async def select_model(model_params: ModelParams):
    check_api_key(model_params.api_key)
    os.environ["OPENAI_API_KEY"] = model_params.api_key
    global model
    match model_params.model_name:
        case 'langchain':
            model = LangChainBaseModel()
        case 'llamaindex':
            model = LLaMAIndexBaseModel()
        case _:
            raise HTTPException(
                status_code=HTTP_400_BAD_REQUEST,
                detail=f'Model name "{model_params.model_name}" not supported.'
            )
    return {"result": "Model has been selected."}


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    with open("tmp.pdf", "wb") as pdf_file:
        pdf_file.write(file.file.read())
    model.load_document("tmp.pdf")
    return {"result": "File uploaded successfully"}


@app.get("/process")
async def process():
    model.create_index()
    return {"result": "File indexed successfully"}


@app.get("/get_sources")
async def get_answer(question: str):
    sources = model.post_question(question)
    return {'sources': sources}


@app.get("/get_answer")
async def get_answer():
    return StreamingResponse(model.answer_aiter(), media_type="text/plain")
