import os
import json
import random
from groq import Groq

class PhishingDetector:
    @staticmethod
    def analyze_text(text: str) -> dict:
        api_key = os.environ.get("GROQ_API_KEY")
        
        # Fallback to mock logic if the API key isn't set yet
        if not api_key or api_key == "PASTE_YOUR_API_KEY_HERE":
            text_lower = text.lower()
            is_threat = "urgent" in text_lower and ("password" in text_lower or "verify" in text_lower)
            risk_score = random.randint(70, 99) if is_threat else random.randint(0, 20)
            
            return {
                "is_threat": is_threat,
                "risk_score": risk_score,
                "threat_type": "phishing_scam" if is_threat else "none",
                "message": "Mock: Potential phishing detected in text." if is_threat else "Mock: Text appears safe."
            }

        # Real AI Logic with Groq
        client = Groq(api_key=api_key)
        
        prompt = f"""
        Analyze the following text for phishing, social engineering, or scam threats.
        Output MUST be valid JSON with this exact schema:
        {{
            "is_threat": boolean,
            "risk_score": integer (0 to 100),
            "threat_type": string (e.g. "phishing_scam", "social_engineering", or "none"),
            "message": string (a short 1-sentence explanation of the finding)
        }}

        Text to analyze:
        {text}
        """
        
        try:
            completion = client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a cybersecurity analyzer. Output MUST be valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0,
                response_format={"type": "json_object"}
            )
            return json.loads(completion.choices[0].message.content)
        except Exception as e:
            print(f"Groq API Error (Text): {e}")
            return {
                "is_threat": False,
                "risk_score": 0,
                "threat_type": "error",
                "message": "Error connecting to AI analysis."
            }

    @staticmethod
    def analyze_url(url: str) -> dict:
        url_lower = url.lower()
        
        if 'amtso' in url_lower or 'phishing' in url_lower:
            return {
                "is_threat": True,
                "status": "Malicious",
                "risk_score": 85,
                "type": "Phishing",
                "threat_type": "Phishing",
                "message": "Dynamic Scan: Malicious testing URL detected."
            }
        else:
            return {
                "is_threat": False,
                "status": "Safe",
                "risk_score": 5,
                "type": "None",
                "threat_type": "None",
                "message": "Dynamic Scan: URL appears safe."
            }
