import os
import pytest
from fastapi.testclient import TestClient
from app.main import app


class BaseTestModel:
    model_name = ""
    client = TestClient(app)

    @classmethod
    def setup_class(cls):
        cls.api_key = os.getenv("OPENAI_API_KEY_TEST")

    def test_select_model(self):
        if self.api_key:
            response = self.client.post(
                "/select_model", json={"model_name": self.model_name, "api_key": self.api_key})
            assert response.status_code == 200
            assert response.json() == {"result": "Model has been selected."}

    def test_upload_pdf(self):
        with open("test.pdf", "rb") as pdf_file:
            response = self.client.post("/upload", files={"file": ("test.pdf", pdf_file, "application/pdf")})

        assert response.status_code == 200
        assert response.json() == {"result": "File uploaded successfully"}

    def test_process(self):
        response = self.client.get("/process")
        assert response.status_code == 200
        assert response.json() == {"result": "File indexed successfully"}

    def test_get_sources(self):
        question = "How old Alice said she was?"
        response = self.client.get(f"/get_sources?question={question}")
        assert response.status_code == 200
        assert "sources" in response.json()

    @pytest.mark.asyncio
    async def test_get_answer(self):
        response = self.client.get("/get_answer")
        assert response.status_code == 200
        await response.aread()


class TestLangChain(BaseTestModel):
    model_name = "langchain"


class TestLLaMaIndex(BaseTestModel):
    model_name = "llamaindex"
