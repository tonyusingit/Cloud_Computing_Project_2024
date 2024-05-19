from flask import Flask, request, send_file
from PIL import Image, ImageDraw, ImageFont
import io

app = Flask(__name__)

@app.route('/generate-image', methods=['POST'])
def generate_image():
    text_description = request.json['text']
    image = create_image_from_text(text_description)
    img_io = io.BytesIO()
    image.save(img_io, 'PNG', quality=70)
    img_io.seek(0)
    return send_file(img_io, mimetype='image/png')

def create_image_from_text(text):
    # 간단한 텍스트 기반 이미지 생성
    img = Image.new('RGB', (200, 100), color=(73, 109, 137))
    d = ImageDraw.Draw(img)
    fnt = ImageFont.load_default()
    d.text((10,10), text, font=fnt, fill=(255, 255, 0))
    return img

if __name__ == '__main__':
    app.run(debug=True, port=5000)
