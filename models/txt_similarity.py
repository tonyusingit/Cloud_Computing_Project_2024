from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import torch

app = Flask(__name__)
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

@app.route('/similarity', methods=['POST'])
def calculate_similarity():
    text1 = request.json['text1']
    text2 = request.json['text2']
    similarity_score = calculate_text_similarity(text1, text2)
    return jsonify({'similarity_score': similarity_score})

def calculate_text_similarity(text1, text2):
    # 문장 임베딩 생성 및 코사인 유사도 계산
    embeddings = model.encode([text1, text2])
    cos_sim = torch.nn.functional.cosine_similarity(torch.tensor([embeddings[0]]), torch.tensor([embeddings[1]]))
    return cos_sim.item()

if __name__ == '__main__':
    app.run(debug=True, port=5001)
