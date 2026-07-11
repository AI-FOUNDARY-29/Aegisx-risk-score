import os
import json
import random
from groq import Groq

class DeepfakeAnalyzer:
    @staticmethod
    def analyze_image(image_url: str) -> dict:
        api_key = os.environ.get("GROQ_API_KEY")
        
        if not api_key or api_key == "PASTE_YOUR_API_KEY_HERE":
            # Fallback mock logic for demo
            is_deepfake = random.choice([True, False])
            risk_score = random.randint(85, 99) if is_deepfake else random.randint(5, 25)
            
            return {
                "is_threat": is_deepfake,
                "risk_score": risk_score,
                "threat_type": "deepfake_manipulation" if is_deepfake else "none",
                "message": "Mock: AI-generated manipulation detected in media." if is_deepfake else "Mock: Media appears authentic."
            }

        client = Groq(api_key=api_key)
        
        prompt = """
        Analyze this image for signs of being a deepfake, AI-generated, or manipulated.
        Look for unnatural lighting, artifacts, blurring, or impossible geometry.
        Output MUST be valid JSON with this exact schema:
        {
            "is_threat": boolean,
            "risk_score": integer (0 to 100),
            "threat_type": string (e.g. "deepfake", "manipulated", or "none"),
            "message": string (a short 1-sentence explanation of the finding)
        }
        """
        
        try:
            completion = client.chat.completions.create(
                model="llama-3.2-11b-vision-preview",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": prompt
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": image_url
                                }
                            }
                        ]
                    }
                ],
                temperature=0,
                response_format={"type": "json_object"}
            )
            return json.loads(completion.choices[0].message.content)
        except Exception as e:
            print(f"Groq API Error (Image): {e}")
            return {
                "is_threat": False,
                "risk_score": 0,
                "threat_type": "error",
                "message": "Error connecting to AI analysis."
            }
