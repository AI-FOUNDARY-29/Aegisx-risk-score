import random

class DeepfakeAnalyzer:
    @staticmethod
    def analyze_media(image_url: str) -> dict:
        # Simulating a 50/50 chance for hackathon demo
        is_deepfake = random.choice([True, False])
        risk_score = random.randint(85, 99) if is_deepfake else random.randint(5, 25)
        
        return {
            "is_threat": is_deepfake,
            "risk_score": risk_score,
            "threat_type": "deepfake_manipulation" if is_deepfake else "none",
            "message": "AI-generated manipulation detected in media." if is_deepfake else "Media appears authentic."
        }
