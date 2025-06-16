from flask import Flask, request, jsonify
from deepface import DeepFace
import base64
import tempfile
import os

app = Flask(__name__)

@app.route('/verify', methods=['POST'])
def verify():
    data = request.json
    img1 = data.get('img1')  # URL Cloudinary hoặc base64 (avatar)
    img2 = data.get('img2')  # base64 (ảnh webcam)

    def save_temp_image(b64_or_url):
        # Nếu là URL, trả về luôn
        if isinstance(b64_or_url, str) and b64_or_url.startswith("http"):
            return b64_or_url
        # Nếu là base64, lưu ra file tạm
        _, b64data = b64_or_url.split(',', 1) if ',' in b64_or_url else ('', b64_or_url)
        img_bytes = base64.b64decode(b64data)
        f = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
        f.write(img_bytes)
        f.close()
        return f.name

    try:
        path1 = save_temp_image(img1)
        path2 = save_temp_image(img2)
        result = DeepFace.verify(path1, path2, enforce_detection=False)
        # Xóa file tạm nếu là base64
        if not path1.startswith("http"):
            os.remove(path1)
        if not path2.startswith("http"):
            os.remove(path2)
        if result['verified']:
            return jsonify({"success": True, "distance": result["distance"]})
        else:
            return jsonify({"success": False, "distance": result["distance"]}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)
