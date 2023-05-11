import time
from queue import Queue
from pathlib import Path
from abc import ABC, abstractmethod
from typing import List, Generator

from llama_index import GPTVectorStoreIndex, download_loader, ServiceContext, LLMPredictor
from llama_index.indices.query.base import BaseQueryEngine
from llama_index.node_parser.simple import SimpleNodeParser
from llama_index.langchain_helpers.text_splitter import TokenTextSplitter

from langchain.document_loaders import pdf
from langchain.indexes import VectorstoreIndexCreator
from langchain.llms.openai import OpenAI
from langchain.callbacks.base import BaseCallbackHandler


class BaseModel(ABC):
    @abstractmethod
    def load_document(self, file_path):
        ...

    @abstractmethod
    def create_index(self):
        ...

    @abstractmethod
    def post_question(self, question) -> List[str]:
        ...

    @abstractmethod
    def answer_aiter(self):
        ...


class LLaMAIndexBaseModel(BaseModel):
    documents = []
    query_engine: BaseQueryEngine
    response_gen: Generator

    def load_document(self, file_path):
        pdf_reader = download_loader("PDFReader")
        loader = pdf_reader()
        self.documents = loader.load_data(file=Path(file_path))

    def create_index(self):
        llm = OpenAI(model_kwargs={"best_of": 1})
        llm_predictor = LLMPredictor(llm=llm)

        text_splitter = TokenTextSplitter(chunk_size=1000, chunk_overlap=0)
        node_parser = SimpleNodeParser(text_splitter=text_splitter)

        service_context = ServiceContext.from_defaults(node_parser=node_parser, llm_predictor=llm_predictor)
        index = GPTVectorStoreIndex.from_documents(self.documents, service_context=service_context)
        self.query_engine = index.as_query_engine(streaming=True)

    def post_question(self, question) -> List[str]:
        response = self.query_engine.query(question)
        self.response_gen = response.response_gen
        sources = [n.node.get_text() for n in response.source_nodes]
        return sources

    def answer_aiter(self):
        return self.response_gen


class CallbackHandler(BaseCallbackHandler):
    queue = Queue()
    stream_end = False

    def on_llm_new_token(self, token: str, **kwargs):
        self.queue.put(token)

    def on_llm_end(self, _, **kwargs):
        self.stream_end = True

    def stream_generator(self):
        while not self.stream_end or not self.queue.empty():
            while not self.queue.empty():
                yield self.queue.get()
            time.sleep(0.1)


class LangChainBaseModel(BaseModel):
    loader = None
    index = None
    answer_generator = None

    def load_document(self, file_path):
        self.loader = pdf.PDFMinerLoader(file_path)

    def create_index(self):
        self.index = VectorstoreIndexCreator().from_loaders([self.loader])

    def post_question(self, question) -> List[str]:
        callback_handler = CallbackHandler()
        llm = OpenAI(temperature=0, streaming=True, callbacks=[callback_handler])

        response = self.index.query_with_sources(
            question, llm, return_source_documents=True
        )

        self.answer_generator = callback_handler.stream_generator()
        sources = [d.page_content for d in response['source_documents']]
        return sources

    def answer_aiter(self):
        return self.answer_generator
