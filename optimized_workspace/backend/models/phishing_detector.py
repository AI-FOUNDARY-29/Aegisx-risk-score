import os
import json
import random
from groq import Groq

class PhishingDetector:

    @staticmethod
    def analyze_text(text: str) -> dict:
        api_key = os.environ.get('GROQ_API_KEY')
        if not api_key or api_key == 'PASTE_YOUR_API_KEY_HERE':
            text_lower = text.lower()
            is_threat = 'urgent' in text_lower and ('password' in text_lower or 'verify' in text_lower)
            risk_score = random.randint(70, 99) if is_threat else random.randint(0, 20)
            return {'is_threat': is_threat, 'risk_score': risk_score, 'threat_type': 'phishing_scam' if is_threat else 'none', 'message': 'Mock: Potential phishing detected in text.' if is_threat else 'Mock: Text appears safe.'}
        client = Groq(api_key=api_key)
        prompt = f'\n        Analyze the following text for phishing, social engineering, or scam threats.\n        Output MUST be valid JSON with this exact schema:\n        {{\n            "is_threat": boolean,\n            "risk_score": integer (0 to 100),\n            "threat_type": string (e.g. "phishing_scam", "social_engineering", or "none"),\n            "message": string (a short 1-sentence explanation of the finding)\n        }}\n\n        Text to analyze:\n        {text}\n        '
        try:
            completion = client.chat.completions.create(model='llama3-8b-8192', messages=[{'role': 'system', 'content': 'You are a cybersecurity analyzer. Output MUST be valid JSON.'}, {'role': 'user', 'content': prompt}], temperature=0, response_format={'type': 'json_object'})
            return json.loads(completion.choices[0].message.content)
        except Exception as e:
            print(f'Groq API Error (Text): {e}')
            return {'is_threat': False, 'risk_score': 0, 'threat_type': 'error', 'message': 'Error connecting to AI analysis.'}

    @staticmethod
    def analyze_url(url: str) -> dict:
        api_key = os.environ.get('GROQ_API_KEY')
        if not api_key or api_key == 'PASTE_YOUR_API_KEY_HERE':
            url_lower = url.lower()
            is_threat = 'login' in url_lower or 'secure' in url_lower or 'update' in url_lower
            risk_score = random.randint(80, 100) if is_threat else random.randint(0, 15)
            return {'is_threat': is_threat, 'risk_score': risk_score, 'threat_type': 'malicious_url' if is_threat else 'none', 'message': 'Mock: Suspicious URL patterns detected.' if is_threat else 'Mock: URL appears safe.'}
        client = Groq(api_key=api_key)
        prompt = f'\n        Analyze the following URL for phishing, typosquatting, or malicious patterns.\n        Output MUST be valid JSON with this exact schema:\n        {{\n            "is_threat": boolean,\n            "risk_score": integer (0 to 100),\n            "threat_type": string (e.g. "malicious_url", "typosquatting", or "none"),\n            "message": string (a short 1-sentence explanation of the finding)\n        }}\n\n        URL to analyze:\n        {url}\n        '
        try:
            completion = client.chat.completions.create(model='llama3-8b-8192', messages=[{'role': 'system', 'content': 'You are a cybersecurity analyzer. Output MUST be valid JSON.'}, {'role': 'user', 'content': prompt}], temperature=0, response_format={'type': 'json_object'})
            return json.loads(completion.choices[0].message.content)
        except Exception as e:
            print(f'Groq API Error (URL): {e}')
            return {'is_threat': False, 'risk_score': 0, 'threat_type': 'error', 'message': 'Error connecting to AI analysis.'}