import speech_recognition as sr
import pyttsx3
import threading
import time
import re
import json
from datetime import datetime, timedelta
import logging
from dataclasses import dataclass
from typing import Dict, List, Optional
import queue

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(_name_)

@dataclass
class HealthRecord:
    """Simple health record structure"""
    date: str
    type: str
    value: str
    notes: str = ""

class HealthDatabase:
    """Simple in-memory health data storage"""
    
    def _init_(self):
        self.records = []
        self.medications = []
        self.appointments = []
        self.symptoms = {}
        
        # Sample health tips
        self.health_tips = {
            "general": [
                "Drink at least 8 glasses of water daily",
                "Get 7-9 hours of sleep each night",
                "Take regular breaks from screen time",
                "Practice deep breathing for stress relief",
                "Eat plenty of fruits and vegetables"
            ],
            "exercise": [
                "Take a 30-minute walk daily",
                "Try stretching exercises in the morning",
                "Use stairs instead of elevators when possible",
                "Do simple desk exercises during work",
                "Dance to your favorite music for fun cardio"
            ],
            "mental_health": [
                "Practice mindfulness meditation",
                "Keep a gratitude journal",
                "Connect with friends and family regularly",
                "Spend time in nature",
                "Limit social media use before bedtime"
            ]
        }
        
        # Common symptoms and basic advice
        self.symptom_advice = {
            "headache": "Stay hydrated, rest in a quiet dark room, and consider gentle neck stretches. If severe or persistent, consult a doctor.",
            "fever": "Rest, drink plenty of fluids, and monitor your temperature. Contact a healthcare provider if fever exceeds 103°F or persists.",
            "cough": "Stay hydrated, use a humidifier, and try warm honey tea. See a doctor if cough persists over 2 weeks.",
            "sore throat": "Gargle with warm salt water, drink warm liquids, and rest your voice. Consult a doctor if severe or lasts over 3 days.",
            "stomach ache": "Try bland foods, stay hydrated, and rest. Avoid dairy and spicy foods. See a doctor if severe or persistent.",
            "back pain": "Apply ice or heat, gentle stretches, and maintain good posture. Consult a healthcare provider if pain is severe."
        }

class VoiceEngine:
    """Responsive voice recognition and synthesis"""
    
    def _init_(self):
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        self.tts_engine = pyttsx3.init()
        self.setup_voice()
        self.listening = False
        self.command_queue = queue.Queue()
        
        # Optimize recognition settings
        self.recognizer.energy_threshold = 4000
        self.recognizer.dynamic_energy_threshold = True
        self.recognizer.pause_threshold = 0.8
        
    def setup_voice(self):
        """Configure TTS for natural conversation"""
        voices = self.tts_engine.getProperty('voices')
        if voices:
            # Prefer female voice for healthcare
            for voice in voices:
                if 'female' in voice.name.lower() or 'zira' in voice.name.lower():
                    self.tts_engine.setProperty('voice', voice.id)
                    break
        
        self.tts_engine.setProperty('rate', 175)  # Comfortable speaking rate
        self.tts_engine.setProperty('volume', 0.9)
    
    def speak(self, text: str):
        """Natural text-to-speech"""
        try:
            logger.info(f"Assistant: {text}")
            self.tts_engine.say(text)
            self.tts_engine.runAndWait()
        except Exception as e:
            logger.error(f"Speech error: {e}")
    
    def listen_once(self, timeout: int = 5) -> Optional[str]:
        """Listen for a single command with timeout"""
        try:
            with self.microphone as source:
                self.recognizer.adjust_for_ambient_noise(source, duration=0.5)
                audio = self.recognizer.listen(source, timeout=timeout, phrase_time_limit=5)
            
            command = self.recognizer.recognize_google(audio).lower()
            logger.info(f"User: {command}")
            return command
            
        except sr.WaitTimeoutError:
            return None
        except sr.UnknownValueError:
            return "unclear"
        except sr.RequestError as e:
            logger.error(f"Recognition error: {e}")
            return None
    
    def listen_continuous(self):
        """Background voice recognition"""
        with self.microphone as source:
            self.recognizer.adjust_for_ambient_noise(source)
        
        while self.listening:
            try:
                with self.microphone as source:
                    audio = self.recognizer.listen(source, timeout=1, phrase_time_limit=4)
                
                command = self.recognizer.recognize_google(audio).lower()
                self.command_queue.put(command)
                
            except (sr.WaitTimeoutError, sr.UnknownValueError):
                continue
            except Exception as e:
                logger.error(f"Continuous listening error: {e}")
                time.sleep(0.5)

class HealthAssistant:
    """Simple, responsive health AI assistant"""
    
    def _init_(self):
        self.voice = VoiceEngine()
        self.health_db = HealthDatabase()
        self.user_name = "friend"
        self.conversation_active = True
        
        # Intent patterns for natural language understanding
        self.intent_patterns = {
            'greeting': [r'hello', r'hi', r'hey', r'good morning', r'good evening'],
            'health_tip': [r'health tip', r'give me advice', r'wellness tip', r'healthy habit'],
            'symptom': [r'i have', r'feeling', r'experiencing', r'symptom', r'hurt', r'pain'],
            'medication': [r'medication', r'medicine', r'pill', r'drug', r'prescription'],
            'appointment': [r'appointment', r'doctor visit', r'checkup', r'schedule'],
            'record': [r'record', r'log', r'track', r'save', r'remember'],
            'exercise': [r'exercise', r'workout', r'fitness', r'activity'],
            'nutrition': [r'food', r'eat', r'diet', r'nutrition', r'meal'],
            'sleep': [r'sleep', r'tired', r'insomnia', r'rest'],
            'mental_health': [r'stress', r'anxiety', r'depression', r'mood', r'mental health'],
            'emergency': [r'emergency', r'urgent', r'serious', r'911'],
            'goodbye': [r'goodbye', r'bye', r'exit', r'quit', r'stop']
        }
    
    def classify_intent(self, text: str) -> str:
        """Simple intent classification using pattern matching"""
        text = text.lower()
        
        for intent, patterns in self.intent_patterns.items():
            for pattern in patterns:
                if re.search(pattern, text):
                    return intent
        
        return 'general'
    
    def handle_greeting(self, text: str):
        """Handle greeting messages"""
        greetings = [
            f"Hello! I'm your health assistant. How can I help you today?",
            f"Hi there! I'm here to help with your health and wellness questions.",
            f"Good to hear from you! What health topic would you like to discuss?",
            f"Hello! I'm ready to assist you with health information and tips."
        ]
        
        import random
        self.voice.speak(random.choice(greetings))
    
    def handle_health_tip(self, text: str):
        """Provide health tips"""
        import random
        
        if 'exercise' in text or 'fitness' in text:
            tip = random.choice(self.health_db.health_tips['exercise'])
        elif 'mental' in text or 'stress' in text:
            tip = random.choice(self.health_db.health_tips['mental_health'])
        else:
            category = random.choice(list(self.health_db.health_tips.keys()))
            tip = random.choice(self.health_db.health_tips[category])
        
        self.voice.speak(f"Here's a health tip for you: {tip}")
    
    def handle_symptom(self, text: str):
        """Handle symptom inquiries"""
        # Extract potential symptoms from text
        found_symptoms = []
        for symptom in self.health_db.symptom_advice.keys():
            if symptom in text.lower():
                found_symptoms.append(symptom)
        
        if found_symptoms:
            symptom = found_symptoms[0]  # Handle first found symptom
            advice = self.health_db.symptom_advice[symptom]
            
            self.voice.speak(f"For {symptom}, here's some general advice: {advice}")
            self.voice.speak("Remember, this is general information only. Please consult a healthcare professional for proper medical advice.")
        else:
            self.voice.speak("I understand you're experiencing some symptoms. Can you be more specific about what you're feeling?")
            
            # Listen for more details
            response = self.voice.listen_once(timeout=10)
            if response and response != "unclear":
                self.handle_symptom(response)
            else:
                self.voice.speak("I recommend speaking with a healthcare professional about your symptoms.")
    
    def handle_medication(self, text: str):
        """Handle medication-related queries"""
        if 'reminder' in text or 'when' in text:
            self.voice.speak("I can help you remember medications. What medication do you need to track?")
            
            response = self.voice.listen_once(timeout=10)
            if response and response != "unclear":
                # Simple medication logging
                med_record = HealthRecord(
                    date=datetime.now().strftime("%Y-%m-%d"),
                    type="medication",
                    value=response,
                    notes="User inquiry"
                )
                self.health_db.records.append(med_record)
                self.voice.speak(f"I've noted your medication: {response}. Remember to take it as prescribed by your doctor.")
        else:
            self.voice.speak("For medication questions, always consult your pharmacist or doctor. They can provide the most accurate information about dosages, interactions, and side effects.")
    
    def handle_exercise(self, text: str):
        """Handle exercise and fitness queries"""
        exercise_responses = [
            "Regular exercise is great for your health! Start with 30 minutes of walking daily.",
            "Try some simple stretches or yoga. Even 10 minutes can make a difference.",
            "Exercise doesn't have to be intense. Dancing, gardening, or playing with pets all count!",
            "Remember to warm up before exercise and cool down afterward to prevent injury."
        ]
        
        import random
        self.voice.speak(random.choice(exercise_responses))
        
        # Ask if they want specific exercise suggestions
        self.voice.speak("Would you like some specific exercise suggestions?")
        response = self.voice.listen_once(timeout=8)
        
        if response and ('yes' in response or 'sure' in response):
            import random
            tip = random.choice(self.health_db.health_tips['exercise'])
            self.voice.speak(f"Here's an exercise suggestion: {tip}")
    
    def handle_nutrition(self, text: str):
        """Handle nutrition and diet questions"""
        nutrition_advice = [
            "A balanced diet includes fruits, vegetables, whole grains, lean proteins, and healthy fats.",
            "Try to eat a rainbow of colorful fruits and vegetables each day.",
            "Stay hydrated by drinking water throughout the day.",
            "Limit processed foods and added sugars when possible.",
            "Portion control is important - listen to your body's hunger cues."
        ]
        
        import random
        self.voice.speak(random.choice(nutrition_advice))
    
    def handle_sleep(self, text: str):
        """Handle sleep-related queries"""
        if 'insomnia' in text or 'trouble sleeping' in text:
            self.voice.speak("For better sleep, try keeping a regular bedtime routine, avoiding screens before bed, and keeping your bedroom cool and dark.")
        else:
            sleep_tips = [
                "Adults need 7-9 hours of sleep each night for optimal health.",
                "Try to go to bed and wake up at the same time every day, even on weekends.",
                "Create a relaxing bedtime routine to signal your body it's time to sleep.",
                "Avoid caffeine and large meals close to bedtime."
            ]
            
            import random
            self.voice.speak(random.choice(sleep_tips))
    
    def handle_mental_health(self, text: str):
        """Handle mental health inquiries"""
        if 'emergency' in text or 'crisis' in text or 'hurt myself' in text:
            self.voice.speak("If you're having thoughts of self-harm, please reach out for immediate help. Contact 988 for the Suicide and Crisis Lifeline, or go to your nearest emergency room.")
            return
        
        mental_health_advice = [
            "Taking care of your mental health is just as important as physical health.",
            "Try practicing mindfulness or meditation for a few minutes each day.",
            "Regular exercise can help improve mood and reduce stress.",
            "Don't hesitate to reach out to friends, family, or a mental health professional.",
            "Keeping a journal can help you process emotions and track mood patterns."
        ]
        
        import random
        self.voice.speak(random.choice(mental_health_advice))
        
        if 'stress' in text:
            self.voice.speak("For immediate stress relief, try taking slow, deep breaths or doing a quick 5-minute meditation.")
    
    def handle_emergency(self, text: str):
        """Handle emergency situations"""
        self.voice.speak("For medical emergencies, call 911 immediately. For poison emergencies, call 1-800-222-1222. I'm not a substitute for emergency medical care.")
    
    def handle_general(self, text: str):
        """Handle general health questions"""
        general_responses = [
            "That's a great health question. For specific medical advice, I recommend consulting with a healthcare professional.",
            "I can provide general wellness information, but for personalized medical advice, please speak with your doctor.",
            "Health is very individual. What works for one person might not work for another, so it's best to get professional guidance.",
            "I'm here to provide general health information and tips. Is there a specific area of health you'd like to know more about?"
        ]
        
        import random
        self.voice.speak(random.choice(general_responses))
    
    def handle_goodbye(self, text: str):
        """Handle goodbye messages"""
        goodbye_messages = [
            "Take care of yourself! Remember, your health is your wealth.",
            "Goodbye! Stay healthy and don't hesitate to ask if you have more health questions.",
            "Have a healthy day! Remember to drink water and get some fresh air.",
            "See you later! Keep up those healthy habits."
        ]
        
        import random
        self.voice.speak(random.choice(goodbye_messages))
        self.conversation_active = False
    
    def process_command(self, text: str):
        """Process user commands and respond appropriately"""
        if not text or text == "unclear":
            self.voice.speak("I didn't catch that clearly. Could you please repeat?")
            return
        
        intent = self.classify_intent(text)
        
        # Route to appropriate handler
        handlers = {
            'greeting': self.handle_greeting,
            'health_tip': self.handle_health_tip,
            'symptom': self.handle_symptom,
            'medication': self.handle_medication,
            'exercise': self.handle_exercise,
            'nutrition': self.handle_nutrition,
            'sleep': self.handle_sleep,
            'mental_health': self.handle_mental_health,
            'emergency': self.handle_emergency,
            'goodbye': self.handle_goodbye,
            'general': self.handle_general
        }
        
        handler = handlers.get(intent, self.handle_general)
        handler(text)
    
    def interactive_mode(self):
        """Interactive conversation mode"""
        self.voice.speak("Hello! I'm your health assistant. I can help with health tips, symptom information, and wellness advice. What would you like to know?")
        
        while self.conversation_active:
            try:
                # Listen for user input
                user_input = self.voice.listen_once(timeout=15)
                
                if user_input:
                    self.process_command(user_input)
                else:
                    # Timeout - offer help
                    self.voice.speak("I'm still here if you need any health information. Just say something!")
                    
            except KeyboardInterrupt:
                self.handle_goodbye("")
                break
            except Exception as e:
                logger.error(f"Error in interactive mode: {e}")
                self.voice.speak("Sorry, I encountered an issue. Let's try again.")
    
    def run(self):
        """Main application loop"""
        try:
            print("🏥 Health AI Voice Assistant Starting...")
            print("💡 Tip: Speak clearly and wait for responses")
            print("📋 Try saying: 'health tip', 'I have a headache', 'exercise advice'")
            print("🚪 Say 'goodbye' or press Ctrl+C to exit\n")
            
            self.interactive_mode()
            
        except KeyboardInterrupt:
            print("\n👋 Thank you for using Health AI Assistant!")
        except Exception as e:
            logger.error(f"Application error: {e}")
            print("❌ Sorry, there was an error. Please restart the application.")

def main():
    """Entry point"""
    assistant = HealthAssistant()
    assistant.run()

if _name_== "_main_":
    main()