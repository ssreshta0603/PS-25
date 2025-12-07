# tasks.py

from celery_app import celery
from nllb_utils import nllb_translate


@celery.task(name="translate_text")
def translate_text_task(text, src_lang, tgt_lang):
    return nllb_translate(text, src_lang, tgt_lang)
