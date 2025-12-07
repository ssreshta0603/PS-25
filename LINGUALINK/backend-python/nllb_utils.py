# nllb_utils.py

from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

MODEL_NAME = "facebook/nllb-200-distilled-600M"

tokenizer = None
model = None

# 15 main languages mapping: short code -> NLLB language code
# Final 5 languages mapping
LANG_CODE = {
    "en": "eng_Latn",   # English
    "hi": "hin_Deva",   # Hindi
    "te": "tel_Telu",   # Telugu
    "fr": "fra_Latn",   # French
    "ko": "kor_Hang"    # Korean
}


def load_model():
    global tokenizer, model
    if tokenizer is None or model is None:
        print(f"Loading NLLB model: {MODEL_NAME}")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)


def nllb_translate(text: str, src_lang: str, tgt_lang: str) -> str:
    """
    Translate text from src_lang to tgt_lang using NLLB.
    src_lang / tgt_lang: short codes like "en", "hi", "ta", "fr", etc.
    """
    load_model()

    # Resolve to NLLB language codes
    src_code = LANG_CODE.get(src_lang, src_lang)
    tgt_code = LANG_CODE.get(tgt_lang, tgt_lang)

    # Source language for tokenizer
    tokenizer.src_lang = src_code

    inputs = tokenizer(
        text,
        return_tensors="pt",
        padding=True,
        truncation=True,
    )

    # Get BOS token id for target language
    forced_bos_token_id = tokenizer.convert_tokens_to_ids(tgt_code)

    generated_tokens = model.generate(
        **inputs,
        forced_bos_token_id=forced_bos_token_id,
        max_length=512,
    )

    return tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]
