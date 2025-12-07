import os
from celery import Celery

REDIS_URL_BROKER = os.getenv("REDIS_URL_BROKER", "redis://localhost:6379/0")
REDIS_URL_BACKEND = os.getenv("REDIS_URL_BACKEND", "redis://localhost:6379/1")

def make_celery():
    celery = Celery(
        "lingualink_nllb",
        broker=REDIS_URL_BROKER,
        backend=REDIS_URL_BACKEND,
        include=["tasks"],  # 👈 Load tasks here
    )
    celery.conf.update(
        task_serializer="json",
        result_serializer="json",
        accept_content=["json"],
        timezone="UTC",
        enable_utc=True,
    )
    return celery

celery = make_celery()
