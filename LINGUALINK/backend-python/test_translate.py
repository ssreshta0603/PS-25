# data = {
#     "text": "Good morning",
#     "src_lang": "en",
#     "tgt_lang": "ta"   # Tamil
# }
import requests

# Backend translate API endpoint
url = "http://127.0.0.1:6000/translate"

# # Change these values to test different texts / languages
data = {
    "text": "Good evening",
    "src_lang": "en",
    "tgt_lang": "ko"
}


try:
    response = requests.post(url, json=data)

    print("Status code:", response.status_code)
    print("Content-Type:", response.headers.get("Content-Type"))
    print("Raw response text:")
    print(response.text)

except requests.exceptions.RequestException as e:
    print("Request failed:", e)
