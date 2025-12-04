---
title: "Voice Commands"
description: "Build natural voice interfaces for robot control and interaction"
module_id: "module-4"
sidebar_position: 3
tags: ["voice", "speech-recognition", "natural-language", "audio"]
difficulty: advanced
estimated_minutes: 25
---

# Voice Commands

## Learning Objectives

By the end of this section, you will be able to:
- Implement speech recognition systems
- Process and understand voice commands
- Build natural language interfaces for robots
- Handle voice feedback and confirmation
- Optimize speech processing for real-time systems
- Integrate voice with planning and execution
- Handle edge cases and ambiguity in speech

## Introduction to Voice Control

Voice interfaces provide natural, intuitive human-robot interaction. Modern speech recognition systems are highly accurate and can be deployed on edge devices. This section explores building production-ready voice command systems for robots.

### Voice Control Pipeline

```
User Speech
    ↓
Audio Capture & Preprocessing
    ↓
Speech Recognition (STT)
    ├── Convert audio to text
    └── Estimate confidence
    ↓
Intent Recognition
    ├── Identify action requested
    ├── Extract parameters
    └── Handle ambiguity
    ↓
Task Planning & Execution
    ↓
Feedback (Text-to-Speech)
```

## Speech Recognition

### Local Speech Recognition with Whisper

```python
import whisper
import numpy as np
import pyaudio
from scipy.io import wavfile

class SpeechRecognitionEngine:
    def __init__(self, model_size="base"):
        """
        Initialize Whisper speech recognition

        model_size: tiny, base, small, medium, large
        """
        self.model = whisper.load_model(model_size)

    def transcribe_audio_file(self, audio_path):
        """Transcribe audio file"""
        result = self.model.transcribe(audio_path)
        return {
            'text': result['text'],
            'language': result['language'],
            'confidence': np.mean([seg['confidence'] for seg in result['segments']])
        }

    def transcribe_microphone(self, duration=5):
        """Capture and transcribe microphone input"""
        audio = self._capture_audio(duration)

        # Transcribe
        result = self.model.transcribe(audio)
        return result['text']

    def _capture_audio(self, duration=5, sample_rate=16000):
        """Capture audio from microphone"""
        p = pyaudio.PyAudio()

        stream = p.open(
            format=pyaudio.paFloat32,
            channels=1,
            rate=sample_rate,
            input=True,
            frames_per_buffer=2048
        )

        print(f"Recording for {duration} seconds...")
        frames = []

        for _ in range(int(duration * sample_rate / 2048)):
            data = stream.read(2048)
            frames.append(np.frombuffer(data, dtype=np.float32))

        stream.stop_stream()
        stream.close()
        p.terminate()

        audio = np.concatenate(frames)
        return audio
```

### Wake Word Detection

```python
from pvporcupine import create

class WakeWordDetector:
    def __init__(self, access_key):
        """Initialize Porcupine wake word detector"""
        self.porcupine = create(
            access_key=access_key,
            keywords=['robot', 'hey robot']
        )

    def detect(self, audio_chunk):
        """
        Detect wake words in audio

        Args:
            audio_chunk: 16-bit PCM audio

        Returns:
            detected_index: Index of detected wake word (-1 if none)
        """
        try:
            keyword_index = self.porcupine.process(audio_chunk)
            return keyword_index
        except Exception as e:
            return -1

    def continuous_detection(self):
        """Continuously monitor for wake words"""
        p = pyaudio.PyAudio()

        stream = p.open(
            format=pyaudio.paInt16,
            channels=1,
            rate=self.porcupine.sample_rate,
            input=True,
            frames_per_buffer=self.porcupine.frame_length
        )

        print("Listening for wake word...")

        try:
            while True:
                pcm = stream.read(self.porcupine.frame_length)
                pcm = np.frombuffer(pcm, dtype=np.int16)

                keyword_index = self.detect(pcm)

                if keyword_index >= 0:
                    print(f"Wake word detected: {self.porcupine.keywords[keyword_index]}")
                    return True

        finally:
            stream.close()
            p.terminate()
```

## Intent Recognition

### Intent Extraction

```python
import spacy
from rasa.nlu.model import Interpreter

class IntentRecognizer:
    def __init__(self, model_path=None):
        """Initialize intent recognition"""
        if model_path:
            self.interpreter = Interpreter.load(model_path)
        else:
            # Use spaCy for basic NLP
            self.nlp = spacy.load("en_core_web_sm")

    def extract_intent(self, text):
        """Extract intent and entities from text"""
        if hasattr(self, 'interpreter'):
            result = self.interpreter.parse(text)
            return {
                'intent': result['intent']['name'],
                'confidence': result['intent']['confidence'],
                'entities': result['entities']
            }
        else:
            return self._extract_with_spacy(text)

    def _extract_with_spacy(self, text):
        """Basic intent extraction with spaCy"""
        doc = self.nlp(text)

        # Simple intent classification
        intent_keywords = {
            'navigation': ['go', 'move', 'navigate', 'drive'],
            'manipulation': ['pick', 'grab', 'place', 'drop', 'grasp'],
            'inspection': ['look', 'see', 'examine', 'check'],
            'help': ['help', 'assist', 'can you']
        }

        detected_intent = 'unknown'
        max_matches = 0

        for intent, keywords in intent_keywords.items():
            matches = sum(1 for token in doc if token.text.lower() in keywords)
            if matches > max_matches:
                max_matches = matches
                detected_intent = intent

        # Extract entities
        entities = [
            {
                'entity': ent.label_,
                'value': ent.text,
                'start': ent.start_char,
                'end': ent.end_char
            }
            for ent in doc.ents
        ]

        return {
            'intent': detected_intent,
            'confidence': min(max_matches / len(doc), 1.0) if doc else 0.0,
            'entities': entities
        }

    def map_to_actions(self, intent_result):
        """Map intent to robot actions"""
        action_mapping = {
            'navigation': self._navigation_action,
            'manipulation': self._manipulation_action,
            'inspection': self._inspection_action,
        }

        if intent_result['intent'] in action_mapping:
            action_func = action_mapping[intent_result['intent']]
            return action_func(intent_result)

        return None

    def _navigation_action(self, intent_result):
        """Convert navigation intent to actions"""
        entities = {e['entity']: e['value'] for e in intent_result['entities']}
        return {
            'action': 'navigate',
            'target': entities.get('LOCATION', 'current_goal'),
            'confidence': intent_result['confidence']
        }

    def _manipulation_action(self, intent_result):
        """Convert manipulation intent to actions"""
        entities = {e['entity']: e['value'] for e in intent_result['entities']}
        return {
            'action': 'manipulate',
            'object': entities.get('OBJECT', 'unknown'),
            'verb': intent_result['intent'],
            'confidence': intent_result['confidence']
        }

    def _inspection_action(self, intent_result):
        """Convert inspection intent to actions"""
        return {
            'action': 'inspect',
            'confidence': intent_result['confidence']
        }
```

## Text-to-Speech

### Speech Synthesis

```python
from pyttsx3 import init as init_tts
from google.cloud import texttospeech
import simpleaudio as sa

class SpeechSynthesizer:
    def __init__(self, engine='google'):
        """
        Initialize text-to-speech

        engine: 'pyttsx3' (local) or 'google' (cloud)
        """
        self.engine = engine

        if engine == 'pyttsx3':
            self.tts = init_tts()
            self.tts.setProperty('rate', 150)
        elif engine == 'google':
            self.client = texttospeech.TextToSpeechClient()

    def speak(self, text):
        """Speak text aloud"""
        if self.engine == 'pyttsx3':
            self._speak_pyttsx3(text)
        elif self.engine == 'google':
            self._speak_google(text)

    def _speak_pyttsx3(self, text):
        """Local TTS with pyttsx3"""
        self.tts.say(text)
        self.tts.runAndWait()

    def _speak_google(self, text):
        """Cloud TTS with Google"""
        input_text = texttospeech.SynthesisInput(text=text)

        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US",
            name="en-US-Neural2-C"
        )

        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.LINEAR16
        )

        response = self.client.synthesize_speech(
            input=input_text,
            voice=voice,
            audio_config=audio_config
        )

        # Play audio
        audio_data = response.audio_content
        play_obj = sa.play_buffer(audio_data, 1, 2, 24000)
        play_obj.wait_done()
```

## Complete Voice Control System

### ROS 2 Voice Command Node

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from geometry_msgs.msg import Twist
import threading

class VoiceCommandNode(rclpy.node.Node):
    def __init__(self):
        super().__init__('voice_command_node')

        # Initialize voice components
        self.wake_detector = WakeWordDetector(access_key="YOUR_KEY")
        self.speech_recognizer = SpeechRecognitionEngine(model_size="base")
        self.intent_recognizer = IntentRecognizer()
        self.synthesizer = SpeechSynthesizer(engine='pyttsx3')

        # Publishers
        self.command_pub = self.create_publisher(
            String,
            '/voice_command',
            10
        )

        self.action_pub = self.create_publisher(
            String,
            '/voice_action',
            10
        )

        # Start voice listening thread
        self.listening = True
        self.listen_thread = threading.Thread(target=self._listen_loop)
        self.listen_thread.daemon = True
        self.listen_thread.start()

    def _listen_loop(self):
        """Main listening loop"""
        while self.listening and rclpy.ok():
            try:
                # Wait for wake word
                if not self.wake_detector.continuous_detection():
                    continue

                self.synthesizer.speak("Ready for command")

                # Capture speech
                audio = self.speech_recognizer._capture_audio(duration=5)

                # Transcribe
                text = self.speech_recognizer.transcribe_microphone()

                if not text:
                    self.synthesizer.speak("I didn't catch that")
                    continue

                self.get_logger().info(f"Recognized: {text}")

                # Extract intent
                intent_result = self.intent_recognizer.extract_intent(text)

                if intent_result['confidence'] < 0.3:
                    self.synthesizer.speak("I'm not sure what you mean")
                    continue

                # Map to action
                action = self.intent_recognizer.map_to_actions(intent_result)

                if action:
                    # Publish command
                    cmd = String()
                    cmd.data = text
                    self.command_pub.publish(cmd)

                    # Publish action
                    action_msg = String()
                    action_msg.data = str(action)
                    self.action_pub.publish(action_msg)

                    # Confirm
                    self.synthesizer.speak(f"Executing {action['action']}")

            except Exception as e:
                self.get_logger().error(f"Error in listen loop: {e}")

    def request_confirmation(self, text):
        """Ask user for confirmation"""
        self.synthesizer.speak(f"Did you mean {text}? Say yes or no.")

        # Listen for confirmation
        audio = self.speech_recognizer._capture_audio(duration=3)
        response = self.speech_recognizer.transcribe_microphone()

        return 'yes' in response.lower()

    def provide_feedback(self, message):
        """Provide audio feedback"""
        self.synthesizer.speak(message)
```

## Advanced Voice Features

### Multi-turn Dialogue

```python
class DialogueManager:
    def __init__(self):
        self.conversation_history = []
        self.context = {}

    def process_utterance(self, text):
        """Process utterance in context"""
        # Add to history
        self.conversation_history.append({
            'type': 'user',
            'text': text
        })

        # Determine if clarification needed
        if self._needs_clarification(text):
            clarification = self._generate_clarification()
            self.conversation_history.append({
                'type': 'robot',
                'text': clarification
            })
            return clarification

        # Generate response
        response = self._generate_response(text)
        self.conversation_history.append({
            'type': 'robot',
            'text': response
        })

        return response

    def _needs_clarification(self, text):
        """Check if input is ambiguous"""
        if 'it' in text or 'that' in text:
            return not self.context.get('current_object')
        return False

    def _generate_clarification(self):
        """Generate clarification question"""
        return "Which object would you like me to interact with?"

    def _generate_response(self, text):
        """Generate robot response"""
        return "Command understood. Executing now."
```

### Emotion and Tone

```python
class EmotionalFeedback:
    def __init__(self):
        self.voice_parameters = {
            'neutral': {'rate': 150, 'volume': 1.0},
            'urgent': {'rate': 180, 'volume': 1.2},
            'confused': {'rate': 100, 'volume': 0.9},
            'excited': {'rate': 170, 'volume': 1.1}
        }

    def speak_with_emotion(self, text, emotion='neutral'):
        """Speak with emotional tone"""
        params = self.voice_parameters.get(emotion, self.voice_parameters['neutral'])

        tts = init_tts()
        tts.setProperty('rate', params['rate'])
        tts.setProperty('volume', params['volume'])

        tts.say(text)
        tts.runAndWait()
```

## Performance Optimization

### Streaming Recognition

```python
class StreamingSpeechRecognition:
    def __init__(self):
        self.chunk_size = 2048
        self.sample_rate = 16000

    def stream_recognition(self, duration=5):
        """Stream audio and recognize incrementally"""
        p = pyaudio.PyAudio()
        stream = p.open(
            format=pyaudio.paFloat32,
            channels=1,
            rate=self.sample_rate,
            input=True,
            frames_per_buffer=self.chunk_size
        )

        audio_chunks = []
        transcripts = []

        for _ in range(int(duration * self.sample_rate / self.chunk_size)):
            chunk = stream.read(self.chunk_size)
            audio_chunks.append(chunk)

            # Incremental recognition
            if len(audio_chunks) % 5 == 0:  # Every 5 chunks
                audio_data = np.frombuffer(b''.join(audio_chunks), dtype=np.float32)
                partial = self._recognize_chunk(audio_data)
                transcripts.append(partial)

        stream.close()
        p.terminate()

        return transcripts

    def _recognize_chunk(self, audio):
        """Recognize audio chunk"""
        # Implementation
        pass
```

## Key Takeaways

- Modern speech recognition enables natural voice interfaces for robots
- Intent recognition bridges speech and robot actions
- Text-to-speech provides audio feedback for user confirmation
- Multi-turn dialogue enables more natural interaction
- Streaming processing reduces latency in voice systems
- Integration with planning systems enables complex voice-controlled tasks

## Next Steps

1. [Build SLAM Systems](./slam.md) - Advanced localization for navigation
2. [Implement Manipulation](./manipulation.md) - Voice-controlled grasping
3. [Create Capstone Project](./capstone-project.md) - Full system integration

## Further Reading

- [Whisper Speech Recognition](https://github.com/openai/whisper)
- [Rasa NLU for Intent Recognition](https://rasa.com/docs/nlu/)
- [Porcupine Wake Word Detection](https://picovoice.ai/products/porcupine/)
- [Voice Interface Design](https://www.nngroup.com/articles/voice-interfaces/)
