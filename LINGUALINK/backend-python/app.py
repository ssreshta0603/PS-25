# app.py

from flask import Flask, request, jsonify
from tasks import translate_text_task  # Celery task

app = Flask(__name__)


@app.route("/translate", methods=["POST"])
def translate():
    """
    HTTP endpoint:
    Expects JSON: { "text": "...", "src_lang": "en", "tgt_lang": "hi" }
    Returns JSON: { "translated_text": "..." }
    """
    data = request.get_json() or {}

    text = data.get("text")
    src_lang = data.get("src_lang")
    tgt_lang = data.get("tgt_lang")

    if not text or not src_lang or not tgt_lang:
        return jsonify({"error": "text, src_lang, tgt_lang are required"}), 400

    # Send task to Celery
    task = translate_text_task.delay(text, src_lang, tgt_lang)

    # For your project demo / testing, we will WAIT for result here.
    # (This blocks the request until Celery finishes, which is fine for now.)
    try:
        result = task.get(timeout=300)  # up to 5 minutes
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"translated_text": result})


if __name__ == "__main__":
    # Run on port 6000 (as you already saw in logs)
    app.run(host="0.0.0.0", port=6000, debug=True)
